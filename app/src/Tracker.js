/* eslint-disable */

import React, { Component, useState } from 'react';
import "./styles/Tracker.css";

const RGAPI_KEY = ''

export class Tracker extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      searchText: '',
      playerData: {
        id: '',
        accountId: '',
        puuid: '',
        name: '',
        revisionDate: '',
        summonerLevel: ''
      },
    }
  }

  getSummoner(e) {
    var request = 'https://oc1.api.riotgames.com/lol/summoner/v4/summoners/by-name/' + this.state.searchText + '?api_key=' + RGAPI_KEY
    fetch(request)
    .then(response => response.json())
    .then(data => this.setState({playerData: data}))
    .catch((error) => {
      console.log(error)
    })
    // console.log(this.state)
  }


  render() {
      return (
    <div className='main'>
      Tracking <b>{this.state.searchText} </b><br />
      <input type='text' onChange={e => this.setState({searchText: e.target.value})}></input>
      <button onClick={e => this.getSummoner(e)}>Press me</button>
      {this.state.playerData.id != ''
      ?
        <p>
          Summoner level: {this.state.playerData.summonerLevel} <br />
          <img width="100px" height="100px" src={'https://ddragon.leagueoflegends.com/cdn/11.24.1/img/profileicon/' + this.state.playerData.profileIconId + '.png'}></img>
        </p>
      :
        <br />
      }
    </div>
    
  );
  }
}