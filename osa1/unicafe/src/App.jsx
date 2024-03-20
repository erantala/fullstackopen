import { useState } from 'react'

const Header = ({ text }) => <h1>{text}</h1>
const Button = ({ handleClick, text }) => <button onClick={handleClick}>{text}</button>
const StatisticLine = ({ text, value }) => <tr><td>{text}</td><td>{value}</td></tr>

const Statistics = ({ good, neutral, bad }) => {
  const total = good + neutral + bad
  const average = (good - bad) / total
  const positive = (good / total) * 100

  if (total === 0) {
    return <p>No feedback given</p>
  }

  return (
    <table>
      <tbody>
      <StatisticLine text="good" value={good} />
      <StatisticLine text="neutral" value={neutral} />
      <StatisticLine text="bad" value={bad} />
      <StatisticLine text="all" value={total} />
      <StatisticLine text="average" value={average} />
      <StatisticLine text="positive" value={`${positive} %`} />
      </tbody>
    </table>
  )

}

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const total = good + neutral + bad

  const clickHandler = (value, setter) => () => setter(value + 1)

  return (
    <div>
      <Header text="give feedback" />
      <Button handleClick={clickHandler(good, setGood)} text="good" />
      <Button handleClick={clickHandler(neutral, setNeutral)} text="neutral" />
      <Button handleClick={clickHandler(bad, setBad)} text="bad" />
      <Header text="statistics" />
      <Statistics good={good} bad={bad} neutral={neutral} />
    </div>
  )
}

export default App