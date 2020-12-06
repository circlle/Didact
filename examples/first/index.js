import Didact from "../../src/index"

function Counter(props) {
  // const [state, setState] = Didact.useState(1)
  return (
    <h1>
      Count: {props.count}
    </h1>
  )
}


Didact.render(
  <Counter count={1}/>,
  document.getElementById("root")
)

Didact.render(
  <Counter count={2}/>,
  document.getElementById("root")
)

setTimeout(() => {
  Didact.render(
    <Counter count={8}/>,
    document.getElementById("root")
  )
}, 5000);
