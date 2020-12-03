import Didact from "../../src/index"

Didact.render(
  <div>
    <p>
      <span>1</span>
    </p>
  </div>,
  document.getElementById("root")
)

setTimeout(
  () => {
    Didact.render(
      <div>
        <p>
          <span>3</span>
        </p>
        <span></span>
      </div>,
      document.getElementById("root")
    )
  },
  1000 * 5
)

