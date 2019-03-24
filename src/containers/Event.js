import React, { Component } from "react"
import { getEvent, getEventPartecipants, getEventAssets, postAsset, attendEvent } from "../helpers/api.js"

class Event extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: "",
      description: "",
      image: "",
      partecipants: [],
      assets: [],
      selectedAssets: {}
    }
  }

  componentDidMount() {
    const id = document.URL.split("/")[4]
    getEvent(id).then(({ name, description, image }) => this.setState({ name, description, image }))
    getEventPartecipants(id).then(partecipants => this.setState({ partecipants }))
    getEventAssets(id)
      .then(assets => assets.map(({ name, id, checked }) => ({ name, id, checked })))
      .then(assets => {
        const selectedAssets = {}
        assets.forEach(({ id }) => selectedAssets[id] = false)
        this.setState({ assets, selectedAssets })
      })
  }

  handleCheckboxUpdate(event) {
    const { selectedAssets } = this.state
    const { id } = event.target
    selectedAssets[id] = !selectedAssets[id]
    this.setState({
      selectedAssets
    })
  }

  handleSubmit(e) {
    const eventId = document.URL.split("/")[4]
    e.preventDefault()
    const selectedAssets = Object.entries(this.state.selectedAssets).map(asset => {
      if (asset[1]) {
        return asset[0]
      }
    }).filter(e => e).map(e => parseInt(e))
    if(this.selectedAssets) {
      selectedAssets.map(asset => postAsset(eventId, asset))
      Promise.all([...selectedAssets, attendEvent(eventId)]).then(console.log)
    } else {
      attendEvent(eventId).then(console.log)
    }
    this.props.history.push("/")
  }

  render() {
    return (
      <div id = { "event" }>
        <div id = { "image-container" }><img src = { this.state.image } id = { "image" }/></div>
        <h1>{ this.state.name }</h1>
        <textarea readOnly id = { "description" } value = { this.state.description }/>
          {
            this.state.assets.length ?
              <fieldset>
                <legend>
                  <span className = { "number" }>✤</span> Scegli come contribuire:
                </legend>
                {
                  this.state.assets.map(({ name, id, checked }) => (
                    <div className = { "inputGroup" }>
                      <input
                        id = { id }
                        type = { "checkbox" }
                        checked = { this.state.selectedAssets[id] || checked}
                        onChange = { this.handleCheckboxUpdate.bind(this) }
                        disabled = { checked }
                      />
                      <label htmlFor = { id }>{name}</label>
                    </div>
                  ))
                }
              </fieldset>
            : ""
          }
        <fieldset>
          <legend>
            <span className = { "number" }>✤</span> Partecipanti:
          </legend>
        </fieldset>
        <div id = { "partecipants" }>
          {
            this.state.partecipants.map(({name, image}) => (
              <img src = { image } title = { name } className = { "profile-pic" }/>
            ))
          }
        </div>
        <div id = { "submit" }>
          <input type="submit" onClick = { this.handleSubmit.bind(this) } value="Partecipa"/>
        </div>
        {/*
        <Map
            google = { this.props.google }
            style = {{ width: "400px", height: "400px", borderRadius: "50%" }}
            zoom = { 15 }
            minZoom = { 11 }
            initialCenter = {{
              lat,
              lng
            }}
        />*/}
      </div>
    )
  }
}

export default Event
