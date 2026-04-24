# Shumoku YAML Reference

ネットワーク図定義のための YAML 記法リファレンス。

## 基本構造

```yaml
name: "Network Diagram"
description: "Optional description"

settings:
  # グラフ設定

subgraphs:
  # サブグラフ（グループ）定義

nodes:
  # ノード（機器）定義

links:
  # リンク（接続）定義
```

---

## Settings

```yaml
settings:
  direction: TB          # レイアウト方向
  theme: light           # テーマ
  nodeSpacing: 50        # ノード間隔
  rankSpacing: 100       # 階層間隔
  subgraphPadding: 20    # サブグラフ内余白
  canvas:                # キャンバス設定
    preset: A4
    orientation: landscape
    width: 1920
    height: 1080
    dpi: 150
    fit: true
    padding: 20
```

### direction
| 値 | エイリアス | 説明 |
|----|-----------|------|
| `TB` | `top-bottom` | 上から下 |
| `BT` | `bottom-top` | 下から上 |
| `LR` | `left-right` | 左から右 |
| `RL` | `right-left` | 右から左 |

### theme
| 値 | 説明 |
|----|------|
| `light` | ライトテーマ |
| `dark` | ダークテーマ |

### canvas.preset (用紙サイズ)
`A0`, `A1`, `A2`, `A3`, `A4`, `B0`, `B1`, `B2`, `B3`, `B4`, `letter`, `legal`, `tabloid`

### canvas.orientation
| 値 | エイリアス | 説明 |
|----|-----------|------|
| `portrait` | `p` | 縦向き |
| `landscape` | `l` | 横向き |

---

## Nodes

```yaml
nodes:
  - id: router-1
    label: "Router 1"
    type: router
    shape: rounded
    parent: subgraph-id
    rank: 1
    vendor: yamaha
    model: rtx3510
    style:
      fill: "#ffffff"
      stroke: "#000000"
      strokeWidth: 2
      strokeDasharray: "5 5"
      textColor: "#333333"
      fontSize: 12
      fontWeight: bold
      opacity: 1.0
```

### label
単一行または複数行:
```yaml
label: "Single line"

label:
  - "<b>Bold title</b>"
  - "Line 2"
  - "---"           # 区切り線
  - "Line 3"
```

### type (デバイスタイプ)
| 値 | エイリアス | 説明 |
|----|-----------|------|
| `router` | - | ルーター |
| `l3-switch` | - | L3 スイッチ |
| `l2-switch` | `switch` | L2 スイッチ |
| `firewall` | - | ファイアウォール |
| `load-balancer` | `lb` | ロードバランサー |
| `server` | - | サーバー |
| `vm` | `virtual-machine`, `virtual_machine` | 仮想マシン |
| `container` | `docker`, `pod` | コンテナ |
| `access-point` | `ap` | アクセスポイント |
| `cloud` | - | クラウド |
| `internet` | - | インターネット |
| `vpn` | - | VPN |
| `database` | `db` | データベース |
| `generic` | - | 汎用 |

### Server 内部に VM / Container を表現する
ノードを直接ノード内にネストするのではなく、Server をサブグラフとして定義し、その `parent` に VM/Container ノードをぶら下げます。

```yaml
subgraphs:
  - id: srv-host-01
    label: "Server Host 01"

nodes:
  - id: vm-app-01
    label: "App VM"
    type: vm
    parent: srv-host-01
    platform: kvm

  - id: ctr-nginx-01
    label: "Nginx"
    type: container
    parent: srv-host-01
    platform: docker
```

### shape (ノード形状)
| 値 | エイリアス | 説明 |
|----|-----------|------|
| `rounded` | `round` | 角丸四角形 (デフォルト) |
| `rect` | `rectangle` | 四角形 |
| `circle` | - | 円 |
| `diamond` | `rhombus` | ひし形 |
| `hexagon` | - | 六角形 |
| `cylinder` | `database` | 円柱 |
| `stadium` | `pill` | スタジアム形 |
| `trapezoid` | - | 台形 |

### vendor / model (ベンダーアイコン)
ハードウェアベンダーのアイコンを表示:
```yaml
vendor: yamaha
model: rtx3510
```

クラウドベンダーの場合:
```yaml
vendor: aws
service: ec2
resource: instances
```

---

## Links

```yaml
links:
  # シンプル形式
  - from: router-1
    to: switch-1

  # ポート指定
  - from:
      node: router-1
      port: eth0
      ip: 192.168.1.1
    to:
      node: switch-1
      port: ge-0/0/0

  # フル指定
  - id: link-1
    from: router-1
    to: switch-1
    label: "10G Uplink"
    type: solid
    arrow: none
    bandwidth: 10G
    redundancy: mlag
    vlan: [10, 20, 30]
    style:
      stroke: "#2196F3"
      strokeWidth: 2
      strokeDasharray: "5 5"
      opacity: 1.0
      minLength: 100
```

### type (リンクタイプ)
| 値 | エイリアス | 説明 |
|----|-----------|------|
| `solid` | - | 実線 (デフォルト) |
| `dashed` | `dotted` | 破線 |
| `thick` | - | 太線 |
| `double` | - | 二重線 |
| `invisible` | `hidden` | 非表示 |

### arrow (矢印)
| 値 | エイリアス | 説明 |
|----|-----------|------|
| `none` | - | 矢印なし |
| `forward` | `->` | 順方向 |
| `back` | `<-` | 逆方向 |
| `both` | `<->` | 双方向 |

### bandwidth (帯域)
| 値 | エイリアス |
|----|-----------|
| `1G` | `1GbE`, `1Gbit` |
| `10G` | `10GbE`, `10Gbit` |
| `25G` | `25GbE`, `25Gbit` |
| `40G` | `40GbE`, `40Gbit` |
| `100G` | `100GbE`, `100Gbit` |

### redundancy (冗長化タイプ)
| 値 | エイリアス | 説明 |
|----|-----------|------|
| `ha` | `vrrp`, `hsrp`, `glbp`, `keepalive` | HA ペア |
| `vc` | `virtual-chassis` | Virtual Chassis |
| `vss` | - | VSS |
| `vpc` | - | vPC |
| `mlag` | `mclag` | MLAG |
| `stack` | `stacking`, `irf` | スタック |

### vlan
単一または複数:
```yaml
vlan: 10
vlan: [10, 20, 30]
```

---

## Subgraphs

```yaml
subgraphs:
  - id: datacenter
    label: "Data Center"
    parent: null          # ルートレベル
    direction: LR         # 内部レイアウト方向
    vendor: aws
    service: vpc
    style:
      fill: "#f0f8ff"
      stroke: "#0072bc"
      strokeWidth: 2
      strokeDasharray: "5 5"
      labelPosition: top
      labelFontSize: 14
      padding: 20
      nodeSpacing: 50
      rankSpacing: 100

  - id: rack-1
    label: "Rack 1"
    parent: datacenter    # ネスト
```

### style.labelPosition
| 値 | 説明 |
|----|------|
| `top` | 上部 |
| `bottom` | 下部 |
| `left` | 左側 |
| `right` | 右側 |

---

## 完全な例

```yaml
name: "Enterprise Network"
description: "本社ネットワーク構成図"

settings:
  direction: TB
  theme: light

subgraphs:
  - id: edge
    label: "Edge Layer"
    style:
      fill: "#fff5f5"
      stroke: "#d4a017"

  - id: core
    label: "Core Layer"
    style:
      fill: "#f0fff0"
      stroke: "#228b22"

nodes:
  - id: rt-01
    label:
      - "<b>RT-01</b>"
      - "192.168.1.1"
    type: router
    vendor: yamaha
    model: rtx3510
    parent: edge

  - id: sw-core-01
    label: "<b>SW-CORE-01</b>"
    type: l3-switch
    vendor: juniper
    model: ex4100-24mp
    parent: core

links:
  - from:
      node: rt-01
      port: lan1
    to:
      node: sw-core-01
      port: ge-0/0/0
    bandwidth: 10G
    arrow: none
```

---

## ベンダーアイコン

詳細は [vendor-icons.md](./vendor-icons.md) を参照。

| ベンダー | 使用例 |
|---------|--------|
| Yamaha | `vendor: yamaha`, `model: rtx3510` |
| Aruba | `vendor: aruba`, `service: access-switch` |
| AWS | `vendor: aws`, `service: ec2`, `resource: instances` |
