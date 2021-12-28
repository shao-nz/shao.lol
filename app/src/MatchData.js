/* eslint-disable */

import React, { Component } from 'react';
import "./styles/MatchData.css";
import championsummary from './data/champion-summary.json';
import items from './data/items.json';
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
    this.state.matchDetails.sort((a, b) => {
      return b.info.gameCreation - a.info.gameCreation
    })
    this.setState({
      loaded: true
    })

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
    background = 'linear-gradient( rgba(15, 255, 191, 0.65), rgba(18, 18, 18))'; 
    gameStatus = 'WIN';
  } else {
    background = 'linear-gradient( rgba(255, 48, 48, 0.65), rgba(18, 18, 18))';
    gameStatus = 'LOSS'
  }

  if (teamEarlySurrendered) {
    background = 'grey';
    gameStatus = 'REMAKE';
  }
  return (
    <div className='individualGame' style={{ background: background}}>
      <DisplayMatchInfo
        gameStatus={gameStatus}
        queueType={matchData.info.queueId}
        gameDuration={matchData.info.gameDuration}
        gameCreation={matchData.info.gameCreation}
      />
      <div className='champGrid'>
        <DisplayChamp
          championId={matchData.info.participants.find(participants => participants.puuid == puuid).championId}
          champLevel={matchData.info.participants.find(participants => participants.puuid == puuid).champLevel}
          championName={matchData.info.participants.find(participants => participants.puuid == puuid).championName}
          perkId={matchData.info.participants.find(participants => participants.puuid == puuid).perks.styles[0].selections[0].perk}
          styleId={matchData.info.participants.find(participants => participants.puuid == puuid).perks.styles[1].style}
          summoner1Id={matchData.info.participants.find(participants => participants.puuid == puuid).summoner1Id}
          summoner2Id={matchData.info.participants.find(participants => participants.puuid == puuid).summoner2Id}
        />
      </div>
      <DisplaySummonerStats
        kills={matchData.info.participants.find(participants => participants.puuid == puuid).kills}
        deaths={matchData.info.participants.find(participants => participants.puuid == puuid).deaths}
        assists={matchData.info.participants.find(participants => participants.puuid == puuid).assists}
        cs={matchData.info.participants.find(participants => participants.puuid == puuid).totalMinionsKilled}
        gameDuration={matchData.info.gameDuration}
      />
      <DisplayItems
        item0={matchData.info.participants.find(participants => participants.puuid == puuid).item0}
        item1={matchData.info.participants.find(participants => participants.puuid == puuid).item1}
        item2={matchData.info.participants.find(participants => participants.puuid == puuid).item2}
        item3={matchData.info.participants.find(participants => participants.puuid == puuid).item3}
        item4={matchData.info.participants.find(participants => participants.puuid == puuid).item4}
        item5={matchData.info.participants.find(participants => participants.puuid == puuid).item5}
        item6={matchData.info.participants.find(participants => participants.puuid == puuid).item6}
      />
      <DisplaySummonerNames
        summonerList={matchData.info.participants}
        key={matchData.metadata.matchId}
      />
    </div>
  )
}

class DisplayMatchInfo extends React.Component {

  epochConverterDate = (dateTime) => {
    var myDate = new Date(dateTime);
    const strDate = myDate.toLocaleDateString();
    return strDate;
  }

  epochConverterTime = (dateTime) => {
    var myDate = new Date(dateTime);
    const strDate = myDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    return strDate;
  }

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
        <div className='gameCreation'>
          {this.epochConverterDate(this.props.gameCreation)} <br/>
          {this.epochConverterTime(this.props.gameCreation)}
        </div>
        <br />
        <div className='gameStatus'>
          <b>{this.props.gameStatus}</b> in:
        </div>
        <div className='gameDuration'>
          {this.secondsToMMSS(this.props.gameDuration)}
        </div>
        <br />
        <div className='queueType'>
          {QUEUE_TYPES[this.props.queueType]}
        </div>
      </div>

    )
  }
}

const getIconPath = (type, id) => {
  const dataMapping = {
    'perk': perks,
    'style': perkStyles,
    'summoner': summonerSpells,
    'item': items,
    'champion': championsummary
  }
  var path = '';
  dataMapping[type].map((item) => {
    if (item.id == id) {
      if (type == 'champion') {
        path = cDragonBasePath + 
          item.squarePortraitPath.replace('/lol-game-data/assets/','').toLowerCase();
      } else {
        path = cDragonBasePath + 
          item.iconPath.replace('/lol-game-data/assets/','').toLowerCase();
      }

    }
  })

  if (path == '' && type == 'item') {
    path = 'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/items/icons2d/gp_ui_placeholder.png';
  }

  return path;
}

const DisplayChamp = ({championId, champLevel, championName, perkId, styleId, summoner1Id, summoner2Id}) => (
  <>
    <div className='champ'>
      <img className='champPortrait' src={getIconPath('champion', championId)}/> <br />
      Level {champLevel} <br />
      {
        championsummary.map((champion) => {
          if (champion.id == championId) {
            return(champion.name)
          }
        })
      }
    </div>
    <div className='spellsRunes'>
      <div className='summonerSpells'>
        <img className='summoner1' src={getIconPath('summoner', summoner1Id)}/>
        <img className='summoner2' src={getIconPath('summoner', summoner2Id)}/>
      </div>
      <div className='runes'> 
        <img src={getIconPath('perk', perkId)}/>
        <img src={getIconPath('style', styleId)}/>
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

const DisplayItems = ({item0, item1, item2, item3, item4, item5, item6}) => (
  <div className='all-items'>
    <div className='items'>
      <img className='item1' src={getIconPath('item', item0)}/>
      <img className='item2' src={getIconPath('item', item1)}/>
      <img className='item3' src={getIconPath('item', item2)}/>
      <img className='item4' src={getIconPath('item', item3)}/>
      <img className='item5' src={getIconPath('item', item4)}/>
      <img className='item6' src={getIconPath('item', item5)}/>
    </div>
    <img className='trinket' src={getIconPath('item', item6)}/>
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
  <div className='blueTeamList truncate'>
    <ul>
      {
        blueTeamList.blueTeamList.map((summoner) => {
          return (
            <div className='summoner' key={summoner.summonerName}>
              <li>
                <img className='champIcon' src={getIconPath('champion', summoner.championId )}/> {summoner.summonerName}
              </li>
            </div>

          )
        })
      }
    </ul>
  </div>
)

const DisplayRedTeam = (redTeamList) => (
  <div className='redTeamList truncate'>
    <ul>
      {
        redTeamList.redTeamList.map((summoner) => {
          return (
            <div className='summoner' key={summoner.summonerName}>
              <li>
                <img className='champIcon' src={getIconPath('champion', summoner.championId )}/> {summoner.summonerName}
              </li>
            </div>
          )
        })
      }
    </ul>
  </div>
)