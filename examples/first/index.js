import Didact, { useState, useEffect, useErrorBoundary } from "../../src/index"

function Counter(props) {
  const [age, setAge] = useState(1)
  const [name, setName] = useState("hello")
  useEffect(
    () => {
      // console.log("enter useEffect", { age, name })
    },
    [age]
  )
  useEffect(
    () => {
      // console.log("enter effect2", { age, name })
    }
  )
  return (
    <div>
      <CounterAge value={age} setValue={setAge} />
      <h1 onClick={() => setName(name === "hello" ? "world" : "hello")}>
        name: {name}
      </h1>
    </div>
  )
}

function CounterAge(props) {
  useErrorBoundary((info) => {
    console.log("info", info)
  })
  // useEffect(() => {
  //   console.log("a in counter age is", a)
  // })
  const { value, setValue } = props
  return <h1 onClick={() => setValue(value => value + 1)}>
    age: {value}
  </h1>
}


Didact.render(
  <Counter />,
  document.getElementById("root")
)
