// Copyright (C) 2026-present Akitoshi Saeki
// SPDX-License-Identifier: AGPL-3.0-only

import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { createNetworkLayoutEngine } from '../layout/index.js'
import { DeviceType } from '../models/index.js'
import { YamlParser } from './parser.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const examplePath = path.resolve(__dirname, '../../../../../examples/vm-container-host.yaml')

describe('VM/container host example', () => {
    it('parses server host subgraph and layouts contained compute nodes', async () => {
        const yaml = await readFile(examplePath, 'utf-8')
        const parser = new YamlParser()
        const result = parser.parse(yaml)

        expect(result.warnings).toBeUndefined()
        expect(result.graph.subgraphs?.length).toBeGreaterThanOrEqual(4)

        const host = result.graph.subgraphs?.find((subgraph) => subgraph.id === 'srv-host-01')
        expect(host?.spec?.kind).toBe('hardware')
        if (host?.spec?.kind === 'hardware') {
            expect(host.spec.type).toBe(DeviceType.Server)
            expect(host.spec.model).toBe('proliant-dl360')
        }

        const vmSubgraph = result.graph.subgraphs?.find((subgraph) => subgraph.id === 'vm-app-01-runtime')
        expect(vmSubgraph?.parent).toBe('srv-host-01')
        expect(vmSubgraph?.spec?.kind).toBe('compute')
        if (vmSubgraph?.spec?.kind === 'compute') {
            expect(vmSubgraph.spec.type).toBe(DeviceType.VM)
            expect(vmSubgraph.spec.platform).toBe('kvm')
        }

        const vmNode = result.graph.nodes.find((node) => node.id === 'vm-app-01')
        expect(vmNode).toBeUndefined()

        const containerNode = result.graph.nodes.find((node) => node.id === 'ctr-nginx-01')
        expect(containerNode?.parent).toBe('vm-app-01-runtime')
        expect(containerNode?.spec?.kind).toBe('compute')
        if (containerNode?.spec?.kind === 'compute') {
            expect(containerNode.spec.type).toBe(DeviceType.Container)
            expect(containerNode.spec.platform).toBe('docker')
        }

        const engine = createNetworkLayoutEngine()
        const layout = await engine.layoutAsync(result.graph)

        expect(layout.nodes.get('ctr-nginx-01')).toBeDefined()
        expect(layout.subgraphs.get('srv-host-01')).toBeDefined()
        expect(layout.subgraphs.get('vm-app-01-runtime')).toBeDefined()
    })
})