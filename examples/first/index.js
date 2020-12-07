import Didact, { useState, useEffect } from "../../src/index"

function Counter(props) {
  const [age, setAge] = useState(1)
  const [name, setName] = useState("dora")
  useEffect(
    () => {
      console.log("enter useEffect", { age, name })
    },
    [age]
  )
  useEffect(
    () => {
      console.log("enter effect2", {age, name})
    }
  )
  return (
    <div>
      <h1 onClick={() => setAge(age => age + 1)}>
        age: {age}
      </h1>
      <h1 onClick={() => setName(name === "kxzhang" ? "dora" : "kxzhang")}>
        name: {name}
      </h1>
    </div>
  )
}


Didact.render(
  <Counter />,
  document.getElementById("root")
)
