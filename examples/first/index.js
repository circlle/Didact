import Didact from "../../src/index"

function Counter() {
  const [state, setState] = Didact.useState(1)
  return (
    <h1 onClick={() => setState(c => c + 1)}>
      Count: {state}
    </h1>
  )
}

const element = <Counter />

Didact.render(
  element,
  document.getElementById("root")
)
