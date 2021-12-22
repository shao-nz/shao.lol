/* eslint-disable */

import React, { Component } from 'react';
import "./styles/MatchData.css";
  
export class MatchData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      start: 0,
      count: 5,
      matchList: [],
      matchDetails: [],
      loaded: false
    };
  }

  async componentDidMount() {
    await this.getMatchList(this.props.uuid);
    await Promise.all(
      this.state.matchList.map(async (matchId) => await this.getMatchDetails(matchId))
    );
    this.setState({
      loaded: true
    })
  }

  epochConverter = (time) => {
    var utcSeconds = time;
    var d = new Date(0);
    d.setUTCSeconds(utcSeconds);
    return d;
  }

  async getMatchList() {
    var request = 'https://shao.lol/api/riot/matchGetMatchList/' + this.props.puuid + '/'+ this.state.start + '/' + this.state.count
    let response = await fetch(request);
    let data = await response.json();
    this.setState({
      matchList: data,
    })
  }

  async getMatchDetails(matchId) {
    var request = 'https://shao.lol/api/riot/matchGetMatchDetails/' + matchId
    let response = await fetch(request);
    let data = await response.json();
    var matchId = data.metadata.matchId;
    this.setState(prevState => ({
      matchDetails: [...prevState.matchDetails, data]
    }))
  }

  render (){
    return ((
      this.state.loaded
      &&
      this.state.matchDetails.map((match) => {
          return (
          <DisplayMatchData
              matchData={match}
              puuid={this.props.puuid}
              key={match.metadata.matchId}
          />
          );
      })
    ))
  }
}

const DisplayMatchData = ({matchData, puuid}) => (
  <div className='individualGame'>
    <DisplaySummonerNames
      summonerNames={matchData.info.participants}
    />
    <DisplayKDA
      kills={matchData.info.participants.find(participants => participants.puuid == puuid).kills}
      deaths={matchData.info.participants.find(participants => participants.puuid == puuid).deaths}
      assists={matchData.info.participants.find(participants => participants.puuid == puuid).assists}
    />
  </div>
)

const DisplaySummonerNames = ({summonerNames}) => (
  <div className='summonerNames'>
    <ul>
    {summonerNames.map((summoner) => {
      return(
        <li key={summoner.summonerName}>
          {summoner.summonerName}
        </li>
      );
    })}
    </ul>
  </div>
)

const DisplayKDA = ({kills, deaths, assists}) => (
  <div className='KDA'>
    {kills}/{deaths}/{assists} <br />
    {((kills + assists)/deaths).toFixed(2)} KDA
  </div>
)