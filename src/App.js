import {Component} from 'react'

import Loader from 'react-loader-spinner'

import './App.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class App extends Component {
  state = {
    activeOptionId: categoriesList[0].id,
    apiStatus: apiStatusConstants.initial,
    projects: [],
  }

  componentDidMount() {
    this.getProjectsList()
  }

  getProjectsList = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {activeOptionId} = this.state
    const url = `https://apis.ccbp.in/ps/projects?category=${activeOptionId}`
    const response = await fetch(url)
    console.log(response)
    if (response.ok === true) {
      const data = await response.json()
      const {projects} = data
      const updatedProjects = projects.map(eachProject => ({
        id: eachProject.id,
        name: eachProject.name,
        imageUrl: eachProject.image_url,
      }))
      this.setState({
        projects: updatedProjects,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onChangeOptionId = event => {
    this.setState({activeOptionId: event.target.value}, this.getProjectsList)
  }

  renderProjectsSuccessView = () => {
    const {projects} = this.state
    return (
      <ul className="projects-list-container">
        {projects.map(eachProject => (
          <li className="each-project-item" key={eachProject.id}>
            <img
              src={eachProject.imageUrl}
              alt={eachProject.name}
              className="project-img"
            />
            <p className="project-name">{eachProject.name}</p>
          </li>
        ))}
      </ul>
    )
  }

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#00BFFF" height={50} width={50} />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="failure-img"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-line">
        We cannot seem to find the page you are looking for
      </p>
      <button
        className="retry-button"
        type="button"
        onClick={this.getProjectsList}
      >
        Retry
      </button>
    </div>
  )

  renderResult = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProjectsSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    const {activeOptionId} = this.state
    return (
      <>
        <div className="header">
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
            className="website-logo-img"
          />
        </div>
        <div className="projects-container">
          <select
            className="options-field"
            value={activeOptionId}
            onChange={this.onChangeOptionId}
          >
            {categoriesList.map(eachCategory => (
              <option key={eachCategory.id} value={eachCategory.id}>
                {eachCategory.displayText}
              </option>
            ))}
          </select>
          {this.renderResult()}
        </div>
      </>
    )
  }
}
export default App
