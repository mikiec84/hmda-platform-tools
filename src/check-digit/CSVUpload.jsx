import React, { PureComponent } from 'react'
import fileSaver from 'file-saver'
import LoadingIcon from '../shared-components/LoadingIcon.jsx'
import Header from '../shared-components/Header.jsx'
import Alert from '../shared-components/Alert.jsx'
import runFetch from './utils/runFetch.js'

const defaultState = {
  isFetching: false,
  filename: '',
  error: false
}

class CSVUpload extends PureComponent {
  constructor(props) {
    super(props)
    this.state = defaultState
    this.handleCSVSelect = this.handleCSVSelect.bind(this)

    this.refScrollTo = React.createRef()
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.isFetching) {
      window.scrollTo({
        top: this.refScrollTo.current.offsetTop,
        behavior: 'smooth'
      })
    }
  }

  onCSVFetch() {
    this.setState({ isFetching: true, error: false })
  }

  onCSVCalculated(response, file, prefix) {
    if (response.status) {
      return this.setState({
        isFetching: false,
        error: true
      })
    }

    const filename = prefix + '-' + file.name

    this.setState({
      isFetching: false,
      filename: filename
    })

    return fileSaver.saveAs(
      new Blob([response], { type: 'text/csv;charset=utf-16' }),
      filename
    )
  }

  makeSelectHandler(url, prefix) {
    return event => this.handleCSVSelect(event, url, prefix)
  }

  handleCSVSelect(event, url, prefix) {
    event.preventDefault()
    const file = event.target.files[0]
    if (!file) return

    event.target.value = null

    this.onCSVFetch()
    runFetch(url, this.prepareCSVBody(file), true).then(res => {
      this.onCSVCalculated(res, file, prefix)
    })
  }

  prepareCSVBody(file) {
    const data = new FormData()
    data.append('file', file)
    return data
  }

  render() {
    return (
      <div className="CSVUpload">
        <div className="Form">
          <Header
            type="sub"
            headingText="Upload a CSV file"
            paragraphText="You can also upload a csv to generate or validate many check
              digits at once."
          />
          <input
            onChange={this.makeSelectHandler(
              'https://ffiec-api.cfpb.gov/public/uli/checkDigit/csv',
              'generated'
            )}
            type="file"
            href="#"
            id="generateCSV"
          />
          <p>
            <label className="usa-button csvLabel" htmlFor="generateCSV">
              Generate check digits
            </label>{' '}
          </p>
          <p>
            <input
              onChange={this.makeSelectHandler(
                'https://ffiec-api.cfpb.gov/public/uli/validate/csv',
                'validated'
              )}
              type="file"
              href="#"
              id="validateCSV"
            />
            <label className="usa-button csvLabel" htmlFor="validateCSV">
              Validate check digits
            </label>
          </p>
          <p className="usa-text-small">
            Please see{' '}
            <a href="http://cfpb.github.io/hmda-platform/uli/#generate-batch">
              the batch section of the API documentation
            </a>{' '}
            for information on csv formatting.
          </p>
        </div>
        <div ref={this.refScrollTo}>
          {this.state.isFetching ? (
            <LoadingIcon />
          ) : this.state.error ? (
            <Alert
              type="error"
              heading="Sorry, an error has occured processing your file."
            >
              <p>
                Please check your file format and try again later. If the
                problem persists, contact{' '}
                <a href="mailto:hmdahelp@cfpb.gov">HMDA Help</a>.
              </p>
            </Alert>
          ) : this.state.filename ? (
            <Alert
              type="success"
              heading="Batch check digit calculation complete"
            >
              <p>
                Downloaded <strong>{this.state.filename}</strong> with your
                batch results.
              </p>
            </Alert>
          ) : null}
        </div>
      </div>
    )
  }
}

export default CSVUpload
