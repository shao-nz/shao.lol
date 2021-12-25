/* eslint-disable */

import React, { Component } from 'react';
import "./styles/MatchData.css";

const TEAMS = {
    'blue': 100,
    'red': 200,
    100: 'blue',
    200: 'red'
  }
  
export class MatchData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      start: 0,
      count: 10,
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

  render() {
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

const DisplayMatchData = ({matchData, puuid}) => {
  var background = '';
  
  var win = matchData.info.participants.find(participants => participants.puuid == puuid).win;
  var teamEarlySurrendered = matchData.info.participants.find(participants => participants.puuid == puuid).teamEarlySurrendered;
  win ? background = 'green' : background = 'red'
  if (teamEarlySurrendered) {
    background = 'grey';
  }
  return (
    <div className='individualGame' style={{ backgroundColor: background}}>
    <DisplayKDA
      kills={matchData.info.participants.find(participants => participants.puuid == puuid).kills}
      deaths={matchData.info.participants.find(participants => participants.puuid == puuid).deaths}
      assists={matchData.info.participants.find(participants => participants.puuid == puuid).assists}
    />
    <DisplaySummonerNames
      summonerList={matchData.info.participants}
      key={matchData.metadata.matchId}
    />
  </div>
  )
}



class DisplaySummonerNames extends React.Component {

  getSummonerNamesByTeam = (summonerList) => {
    var summonersByTeamDict = {};
    for (const summonerDict of summonerList) {
      if (summonerDict.teamId == TEAMS.blue) {
        summonersByTeamDict['blue'] = summonersByTeamDict['blue'] || [];
        summonersByTeamDict['blue'].push(summonerDict);
      } else if (summonerDict.teamId == TEAMS.red){
        summonersByTeamDict['red'] = summonersByTeamDict['red'] || [];
        summonersByTeamDict['red'].push(summonerDict);
      }
    }
    return summonersByTeamDict;
  }

  render() {
    const summonersByTeamDict = this.getSummonerNamesByTeam(this.props.summonerList);
    return (
      <div className='summonerNames'>
        <DisplayBlueTeam
          blueTeamList={summonersByTeamDict.blue}
        />
        <DisplayRedTeam
          redTeamList={summonersByTeamDict.red}
        />
      </div>
    )
  }
}


const DisplayKDA = ({kills, deaths, assists}) => (
  <div className='KDA'>
    {kills}/{deaths}/{assists} <br />
    {((kills + assists)/deaths).toFixed(2)} KDA
  </div>
)

const DisplayBlueTeam = (blueTeamList) => (
  <div className='blueTeamList'>
    <ul>
      {
        blueTeamList.blueTeamList.map((summoner) => {
          return (
            <div className='summoner'>
              <li key={summoner.summonerName}>
              <img src={'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/' + summoner.championId + '.png'}/> {summoner.summonerName}
              </li>
            </div>

          )
        })
      }
    </ul>
  </div>
)

const DisplayRedTeam = (redTeamList) => (
  <div className='redTeamList'>
    <ul>
      {
        redTeamList.redTeamList.map((summoner) => {
          return (
            <div className='summoner'>
              <li key={summoner.summonerName}>
              <img src={'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/' + summoner.championId + '.png'}/> {summoner.summonerName}
              </li>
            </div>
          )
        })
      }
    </ul>
  </div>
)