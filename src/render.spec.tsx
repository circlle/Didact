import Didact from "./index"
import { render } from "./render"

describe("render", () => {
  it('render function', () => {
    const container = document.createElement("div")
    const element = (
      <div id="foo">
        <a>bar</a>
        <b />
      </div>
    )
    render(element, container)
    expect(container.firstElementChild?.getAttribute("id")).toBe("foo")
  })
})