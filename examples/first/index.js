import Didact from "../../src/index"

let count = 0

function rerender() {
  count++
  Didact.render(
    <div>
      <p>
        <span>{count}</span>
      </p>
      <button onClick={rerender}>增加</button>
    </div>,
    document.getElementById("root")
  )
}

rerender()

