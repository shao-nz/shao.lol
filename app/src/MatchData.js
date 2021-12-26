/* eslint-disable */

import React, { Component } from 'react';
import "./styles/MatchData.css";
import perks from './data/perks.json';
import perkStyles from './data/perkstyles.json';
import summonerSpells from './data/summoner-spells.json';

const cDragonBasePath = 'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/';

const TEAMS = {
  'blue': 100,
  'red': 200,
  100: 'blue',
  200: 'red'
}

const QUEUE_TYPES = {
  400: 'Normals',
  420: 'Ranked Solo',
  430: 'Ranked Flex',
  450: 'ARAM',
  700: 'Clash',
  830: 'Intro Bots',
  840: 'Beginner Bots',
  850: 'Intermediate Bots',
  900: 'URF',
  910: 'Ascension',
  920: 'Legend of the Poro King',
  940: 'Nexus Siege',
  1010: 'Snow ARURF',
  1020: 'One for All',
  1300: 'Nexus Blitz',
  1400: 'Ultimate Spellbook'
}

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
    // console.log(this.state.matchDetails)
    // var thing = this.state.matchDetails.sort(function(a, b) {
    //   // console.log(b.info.gameCreation - a.info.gameCreation)
    //   return a.info.gameCreation - b.info.gameCreation;
    // })
    // console.log(thing)
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
  var gameStatus = '';
  var win = matchData.info.participants.find(participants => participants.puuid == puuid).win;
  var teamEarlySurrendered = matchData.info.participants.find(participants => participants.puuid == puuid).teamEarlySurrendered;
  if (win) {
    background = 'green'; 
    gameStatus = 'WIN';
  } else {
    background = 'red';
    gameStatus = 'LOSS'
  }

  if (teamEarlySurrendered) {
    background = 'grey';
    gameStatus = 'REMAKE';
  }
  return (
    <div className='individualGame' style={{ backgroundColor: background}}>
    <div className='champGrid'>
      {console.log(matchData)}
      <DisplayChamp
        championId={matchData.info.participants.find(participants => participants.puuid == puuid).championId}
        champLevel={matchData.info.participants.find(participants => participants.puuid == puuid).champLevel}
        championName={matchData.info.participants.find(participants => participants.puuid == puuid).championName}
        perkId={matchData.info.participants.find(participants => participants.puuid == puuid).perks.styles[0].selections[0].perk}
        styleId={matchData.info.participants.find(participants => participants.puuid == puuid).perks.styles[1].style}
        summoner1Id={matchData.info.participants.find(participants => participants.puuid == puuid).summoner1Id}
      />
    </div>
    <DisplayMatchInfo
      gameStatus={gameStatus}
      queueType={matchData.info.queueId}
      gameDuration={matchData.info.gameDuration}
    />
    <DisplaySummonerStats
      kills={matchData.info.participants.find(participants => participants.puuid == puuid).kills}
      deaths={matchData.info.participants.find(participants => participants.puuid == puuid).deaths}
      assists={matchData.info.participants.find(participants => participants.puuid == puuid).assists}
      cs={matchData.info.participants.find(participants => participants.puuid == puuid).totalMinionsKilled}
      gameDuration={matchData.info.gameDuration}
    />
    <DisplaySummonerNames
      summonerList={matchData.info.participants}
      key={matchData.metadata.matchId}
    />
  </div>
  )
}

class DisplayMatchInfo extends React.Component {

  secondsToMMSS = (seconds) => {
    var timeString = '';
    var MM = Math.floor(seconds/60);
    var SS = seconds - (MM * 60);
    timeString = `${MM}:${SS.toString().padStart(2, "0")}`;

    return timeString;
  }

  render() {
    return (
      <div className='matchInfo'>
        <b>{this.props.gameStatus}</b> in:
        <div className='gameDuration'>
          {this.secondsToMMSS(this.props.gameDuration)}
        </div>
        <div className='queueType'>
          {QUEUE_TYPES[this.props.queueType]}
        </div>
      </div>

    )
  }
}

const getPerkIconPath = (perkId) => {
  var perkPath = '';
  perks.map((perk) => {
    if (perk.id == perkId) {
      perkPath = cDragonBasePath + 
      perk.iconPath.replace('/lol-game-data/assets/','').toLowerCase()
    }
  })

  return perkPath;
}

const getPerkStyleIconPath = (styleId) => {
  var stylePath = '';
  perkStyles.map((style) => {
    if (style.id == styleId) {
      stylePath = cDragonBasePath + 
      style.iconPath.replace('/lol-game-data/assets/','').toLowerCase()
    }
  })

  return stylePath;
}

const getSummonerSpellIconPath = (summonerId) => {
  var summonerPath = '';
  summonerSpells.map((summoner) => {
    if (summoner.id == summonerId) {
      summonerPath = cDragonBasePath + 
      summoner.iconPath.replace('/lol-game-data/assets/','').toLowerCase()
    }
  })

  return summonerPath;
}

const DisplayChamp = ({championId, champLevel, championName, perkId, styleId, summoner1Id}) => (
  <>
    <div className='champ'>
      <img src={'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/' + championId + '.png'}/> <br />
      Level {champLevel} <br />
      {championName}
    </div>
    <div className='spellsRunes'>
      <div className='summonerSpells'>
        <img className='summoner1' src={getSummonerSpellIconPath(summoner1Id)}/>
      </div>
      <div className='runes'> 
        <img className='keystone' src={getPerkIconPath(perkId)}/>
        <img className='secondaryRune' src={getPerkStyleIconPath(styleId)}/>
      </div>
    </div>
  </>
)


const DisplaySummonerStats = ({kills, deaths, assists, cs, gameDuration}) => (
  <div className='summonerStats'>
    <div className='CSStats'>
    {cs} CS <br />
    <b>({(cs/(gameDuration/60)).toFixed(1)})</b> CS/m
    </div>
    <div className='KDA'>
      {kills}/{deaths}/{assists} <br />
      {((kills + assists)/deaths).toFixed(2)} KDA
    </div>
  </div>
)

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

const DisplayBlueTeam = (blueTeamList) => (
  <div className='blueTeamList'>
    <ul>
      {
        blueTeamList.blueTeamList.map((summoner) => {
          return (
            <div className='summoner' key={summoner.summonerName}>
              <li>
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
            <div className='summoner' key={summoner.summonerName}>
              <li>
              <img src={'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/' + summoner.championId + '.png'}/> {summoner.summonerName}
              </li>
            </div>
          )
        })
      }
    </ul>
  </div>
)