/* eslint-disable */

import React, { Component } from 'react';
import "./styles/Tracker.css";

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

  export class SummonerProfile extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        summonerByNameData: {},
        leagueEntriesBySummonerData: []
      };
    }

    async componentDidMount() {
      const summonerName = this.props.summonerName.toLowerCase();
      await this.getSummonerByName(summonerName);
      await this.getLeagueEntriesBySummoner(this.state.summonerByNameData.id)
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
      var request = 'https://shao.lol/api/riot/lol-by-summoner/' + summonerId
      let response = await fetch(request);
      let data = await response.json();
      // var currentLeagueEntries = {};
      // currentLeagueEntries[data.Summonername.toLowerCase()] = data;
      this.setState({
        leagueEntriesBySummonerData: data,
      });
      // console.log(this.state.leagueEntriesBySummonerData)
    }

    render() {
      return (
        <div className='summonerProfile'>
          <p>
            Tracking <b>{this.state.summonerByNameData.name} </b> <br />
            <img width="100px" height="100px" src={'https://ddragon.leagueoflegends.com/cdn/11.24.1/img/profileicon/' + this.state.summonerByNameData.profileIconId + '.png'}></img> <br />
            {this.state.summonerByNameData.summonerLevel} <br />
          </p>
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
              ))}
        </div>
      );
    }
  }

export class Tracker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
      summonerFound: false,
      summonerByNameData: {},
      leagueEntriesBySummonerData: []
    };
    this.onFormSubmit = this.onFormSubmit.bind(this);
  }

  async onFormSubmit(e) {
    e.preventDefault();
    await this.getSummonerByName(this.state.searchText);
    console.log(this.state.summonerByNameData)
    await this.getLeagueEntriesBySummoner(this.state.summonerByNameData[this.state.searchText].id);
  }

  render() {
    return (
      <div>
        <div className='searchBar'>
            <button/>
            {/* <form onSubmit={this.onFormSubmit}>
                <input type='text' onChange={e => this.setState({searchText: e.target.value.toLowerCase().replace(/ /g, '')})}></input>
                <button type='submit' /> <br />
            </form> */}
        </div>
        <SummonerProfile
          summonerName="Shao"
        />
        <SummonerProfile
          summonerName="Harbinsink"
        />
        {/* {this.state.summonerFound == true
        ?
        <SummonerProfile
          summonerByNameData={this.state.summonerByNameData}
          leagueEntriesBySummonerData={this.state.leagueEntriesBySummonerData}
        />
        :
          <p>
          </p>
          
        } */}
      </div>
  );
  }
}
