/* eslint-disable */

import React from "react";
import { SummonerProfile } from "./SummonerProfile";
import { MatchData } from "./MatchData";
import "./styles/Tracker.css";

export class Tracker extends React.Component {
  constructor(props) {
    super(props);
    const listSummonerNames = [
      "Shao",
      "Asvalbina",
      "Harbinsink",
    ];

    let initialSummoners = {};
    for (const summonerName of listSummonerNames) {
      initialSummoners[summonerName] = {
        summonerByNameData: {},
        matchDataVisible: false,
      }
    }

    this.state = {
      summoners: initialSummoners
    };
  }

  handleCallback = (summonerName, summonerData, matchData) => {
    let summonersCopy = { ...this.state.summoners };
    for (const [key, val] of Object.entries(summonersCopy)) {
      if (summonerName !== key) {
        val.matchDataVisible = false;
      }
    }

    summonersCopy[summonerName] = {
      summonerByNameData: summonerData,
      matchDataVisible: matchData,
    }

    this.setState({
      summoners: summonersCopy
    });
  };

  render() {
    return (
      <>
        <div className="big-box">
          <div className="summoners">
            {
              Object.keys(this.state.summoners).map((summoner) => {
                return (
                  <SummonerProfile
                  summonerName={summoner}
                  passToParent={this.handleCallback}
                  key={summoner}
                />
                )
              })
            }
          </div>
          <div className="matchData">
            {
              
              Object.values(this.state.summoners).map((summoner) => {
                return (
                  summoner.matchDataVisible
                  &&
                  <MatchData puuid={summoner.summonerByNameData.puuid} key={summoner.summonerByNameData.name}/>
                )
              })
            }
          </div>
        </div>
      </>
    );
  }
}
