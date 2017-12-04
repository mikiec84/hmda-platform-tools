import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Alert from './Alert.jsx'

class Form extends Component {
  constructor(props) {
    super(props)

    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleRadioChange = this.handleRadioChange.bind(this)
    this.handleFormSubmit = this.handleFormSubmit.bind(this)
  }

  componentDidMount() {
    this.dataInput.focus()
  }

  handleInputChange(event) {
    this.props.onInputChange(event.target.value)
    this.props.validateInput(event.target.value)
  }

  handleRadioChange(event) {
    this.props.onRadioChange(event.target.value)
  }

  handleFormSubmit(event) {
    event.preventDefault()
    this.props.onSubmit(this.props.inputValue)
  }

  render() {
    if (!this.props.onSubmit)
      return (
        <Alert type="error" heading="Uh oh!">
          <p>Something went wrong. Submitting a loan ID won't work.</p>
        </Alert>
      )

    const { whichApp, errors, inputValue } = this.props

    const label = {
      get: (
        <label htmlFor="dataInput">
          Enter the <abbr title="Legal Entity Identifier">LEI</abbr> and
          Loan/Application ID<br />
          <span className="usa-text-small">
            A value used to identify a loan or application that is comprised of
            letters, numbers or a combination of both letters and numbers, and
            is unique within the financial institution.
          </span>
        </label>
      ),
      validate: (
        <label htmlFor="dataInput">
          Enter the <abbr title="Universal Loan Identifier">ULI</abbr>
          <br />
          <span className="usa-text-small">
            The Universal Loan Identifier (ULI) is a unique value assigned to
            the loan or application. The ULI is comprised of the financial
            institution's Legal Entity Identifier (LEI), the institution
            assigned Loan or Application ID, and a two character check digit
            calculated using the ISO/IEC 7064, MOD 97-10.
          </span>
        </label>
      )
    }[whichApp]

    const buttonText = {
      get: 'Generate a check digit',
      validate: 'Validate a check digit'
    }[whichApp]

    const buttonDisabled =
      errors.length === 0 && inputValue !== '' ? false : true

    return (
      <form
        className="Form usa-grid"
        id="main-content"
        onSubmit={this.handleFormSubmit}
      >
        <ul className="usa-unstyled-list">
          <li>
            <input
              id="getCheckDigit"
              type="radio"
              name="whichApp"
              value="get"
              onChange={this.handleRadioChange}
              checked={whichApp === 'get'}
            />
            <label htmlFor="getCheckDigit">Generate a check digit</label>
          </li>
          <li>
            <input
              id="validateCheckDigit"
              type="radio"
              name="whichApp"
              value="validate"
              onChange={this.handleRadioChange}
              checked={whichApp === 'validate'}
            />
            <label htmlFor="validateCheckDigit">Validate a ULI</label>
          </li>
        </ul>
        {label}
        {errors.map((error, i) => {
          return (
            <span key={i} className="usa-input-error-message" role="alert">
              {error}
            </span>
          )
        })}
        <input
          id="dataInput"
          ref={input => {
            this.dataInput = input
          }}
          type="text"
          value={inputValue}
          onInput={this.handleInputChange}
        />
        <input disabled={buttonDisabled} type="submit" value={buttonText} />
      </form>
    )
  }
}

Form.propTypes = {
  inputValue: PropTypes.string.isRequired,
  onInputChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  validateInput: PropTypes.func.isRequired,
  errors: PropTypes.array,
  onRadioChange: PropTypes.func,
  whichApp: PropTypes.string
}

export default Form
