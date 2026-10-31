# @lp-labs/react-roving-focus

Roving tab stops for custom keyboard-driven groups. React 18+ peer only; TypeScript, ESM and CommonJS included.

## Installation

```sh
npm install @lp-labs/react-roving-focus
```

## Quick Start

```jsx
import { RovingFocus } from '@lp-labs/react-roving-focus';
const ids = ['one', 'two', 'three'];
export default function Example() {
  return (
    <RovingFocus ids={ids} role="toolbar" aria-label="Actions" orientation="horizontal">
      {(group) =>
        ids.map((id) => (
          <button key={id} {...group.getItemProps(id)}>
            {id}
          </button>
        ))
      }
    </RovingFocus>
  );
}
```

## API

`useRovingFocus(ids,{disabledIds,orientation='both',loop=true,direction='ltr',activeId,onActiveChange})` returns `activeId`, `focus(id):boolean`, `getItemProps(id)`. Spread all item props, including ref, on each focusable element. Arrows navigate the configured axis, RTL reverses horizontal arrows, Home/End reach endpoints, disabled IDs are skipped. `RovingFocus` wraps the hook and renders children(group); div attributes are supported. Controlled activeId requires applying onActiveChange.

## Benefits

| Area                | Details                                            |
| ------------------- | -------------------------------------------------- |
| One tab stop        | Keep arrow-navigation groups compact in tab order. |
| RTL support         | Reverse horizontal navigation when configured.     |
| No global listeners | Apply returned props to your own items.            |

## Customization

| Area             | Details                                        |
| ---------------- | ---------------------------------------------- |
| Navigation       | Set IDs, orientation, wrapping, and direction. |
| Disabled items   | Provide disabled IDs to skip.                  |
| Controlled focus | Pass active ID and receive changes.            |

## Security And Limits

At most10,000 unique IDs. The hook manages focus, not selection, roles, labels or authorization. Nested editable targets are not intercepted. Supply widget-appropriate roles and do not override returned keyboard/ref handlers without composing them. All-disabled groups have no managed tab stop; provide an appropriate application focus fallback. No document-global listener is installed; SSR is supported.

## Support

[Donate via PayPal](https://www.paypal.me/LibinPrasanth). Author: [Libin Prasanth](https://www.linkedin.com/in/libinprasanth/).

## License

MIT License. See the packaged [LICENSE](LICENSE) file.
