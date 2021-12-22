/* eslint-disable */

import React, { Component } from 'react';
import "./styles/Tracker.css";
import logo from "./static/cursed_flushed.png";

const QUEUE_TYPES = {
  "RANKED_FLEX_SR": "Ranked Flex",
  "RANKED_SOLO_5x5": "Ranked Solo"
}

const TIERS = {
  "IRON": "Iron",
  "BRONZE": "Bronze",
  "SILVER": "Silver",
  "GOLD": "Gold",
  "PLATINUM": "Platinum",
  "DIAMOND": "Diamond",
  "MASTER": "Master",
  "GRANDMASTER": "Grandmaster",
  "CHALLENGER": "Challenger"
}

const LobbyType = ({queueType, tier, rank, leaguePoints, wins, losses}) => (
  <div>
    <p>
      {queueType} <br />
      {tier} {rank} {leaguePoints }LP<br />
      Wins: {wins} Losses: {losses} <br /> 
    </p>
  </div>
);

const DisplayMatchData = ({matchData}) => (
  <div className='individualGame'>
    <ul>
    {matchData.info.participants.map((summoner) => {
      return(
        <li key={summoner.summonerName}>
          {summoner.summonerName}
        </li>
      );
    })}
    </ul>
  </div>
)

  class MatchData extends React.Component {
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

    render (){
      return (
        (this.state.loaded
        &&
        <div className='matchData'>
          {this.state.matchDetails.map((match) => {
            return (
              <DisplayMatchData
                matchData={match}
                key={match.metadata.matchId}
              />
            );
          })}
        </div>
      ))
    }
  }

  class SummonerProfile extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        summonerByNameData: {},
        leagueEntriesBySummonerData: [],
        matchDataVisible: false,
        summonerFound: false
      };
    }

    showHiddenDiv = () => {
      this.setState(
        prevState => ({
          matchDataVisible: !prevState.matchDataVisible}));
      this.props.passToParent(this.state.summonerByNameData, !this.state.matchDataVisible);
    }

    async componentDidMount() {
      const summonerName = this.props.summonerName.toLowerCase().replace(/ /g, '');
      await this.getSummonerByName(summonerName);
      await this.getLeagueEntriesBySummoner(this.state.summonerByNameData.id)
      this.setState({
        summonerFound: true
      })
    }

    async getSummonerByName(summonerName) {
      var request = 'https://shao.lol/api/riot/summoner/' + summonerName
      let response = await fetch(request);
      let data = await response.json();
      // var currentSummoner = {};
      // currentSummoner[data.name.toLowerCase()] = data;
      this.setState({
        summonerByNameData: data,
      })
    }

    async getLeagueEntriesBySummoner(summonerId) {
      var request = 'https://shao.lol/api/riot/lolBySummoner/' + summonerId
      let response = await fetch(request);
      let data = await response.json();
      // var currentLeagueEntries = {};
      // currentLeagueEntries[data.Summonername.toLowerCase()] = data;
      this.setState({
        leagueEntriesBySummonerData: data,
      });
    }

    render() {
      return (
          this.state.summonerFound
          &&
            <div className='summonerProfile cursor-pointer' onClick={this.showHiddenDiv}>
              Tracking <b>{this.state.summonerByNameData.name} </b> <br />
              <img src={'https://ddragon.leagueoflegends.com/cdn/11.24.1/img/profileicon/' + this.state.summonerByNameData.profileIconId + '.png'}></img> <br />
              {this.state.summonerByNameData.summonerLevel} <br />
              {this.state.leagueEntriesBySummonerData.map((data) => (
              <LobbyType
                queueType={QUEUE_TYPES[data.queueType]}
                tier={TIERS[data.tier]}
                rank={data.rank}
                leaguePoints={data.leaguePoints}
                wins={data.wins}
                losses={data.losses}
                key={data.leagueId}
                />
                ))
              }
            </div>
      );
    }
  }

export class Tracker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
      summonerByNameData: {},
      matchDataVisible: false
    };
  }

  handleCallback = (summonerData, matchData) => {
    this.setState({
      summonerByNameData: summonerData,
      matchDataVisible: matchData
    })
  }

  render() {
    return (
        <>
        <img src={logo} alt='cursed flushed emoji'></img>
        <div className='big-box'>
          {/* <div className='searchBar'>
              <button/>
              <form onSubmit={this.onFormSubmit}>
                  <input type='text' onChange={e => this.setState({searchText: e.target.value.toLowerCase().replace(/ /g, '')})}></input>
                  <button type='submit' /> <br />
              </form>
          </div> */}
          <div className='summoners'>
            <SummonerProfile
              summonerName='Shao'
              passToParent = {this.handleCallback}
            />
            <SummonerProfile
              summonerName="Harbinsink"
              passToParent = {this.handleCallback}
            />
            <SummonerProfile
              summonerName="Barny Fargo"
              passToParent = {this.handleCallback}
            />
            <SummonerProfile
              summonerName="Jozendas"
              passToParent = {this.handleCallback}
            />
          </div>
          {
            this.state.matchDataVisible
            &&
            <MatchData
                puuid={this.state.summonerByNameData.puuid}
                />
          }
        </div>
        </>
  );
  }
}
