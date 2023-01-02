#[macro_use]
extern crate rocket;

use rocket::get;
use rocket::http::Status;
use rocket::request::Request;
use rocket::response::{self, Responder};
use rocket::serde::json::Json;
use serde::Serialize;

const RIOT_API_DEV: &str = env!("RIOT_API_DEV", "Please set RIOT_API_DEV");
// const RIOT_API_PROD: &str = env!("RIOT_API_PROD", "Please set RIOT_API_PROD");

pub struct JsonErr<T: Serialize>(pub T, pub Status);

impl<'r, T: Serialize> Responder<'r, 'r> for JsonErr<T> {
    fn respond_to(self, r: &Request) -> response::Result<'r> {
        let json_self = Json(self.0);
        json_self.respond_to(r).map(|mut r| {
            r.set_status(self.1);
            r
        })
    }
}

#[derive(Serialize)]
pub enum ResultErr {
    NotFound,
}

#[get("/summoner/<summoner_name>")]
async fn summoner(summoner_name: String) -> Result<Json<String>, JsonErr<ResultErr>> {
    let url = format!("https://oc1.api.riotgames.com/lol/summoner/v4/summoners/by-name/{summoner_name}?api_key={RIOT_API_DEV}");

    get(&url).await
}

#[get("/lolBySummoner/<summoner_id>")]
async fn lol_by_summoner(summoner_id: String) -> Result<Json<String>, JsonErr<ResultErr>> {
    let url = format!("https://oc1.api.riotgames.com/lol/league/v4/entries/by-summoner/{summoner_id}?api_key={RIOT_API_DEV}");

    get(&url).await
}

#[get("/matchList/<puuid>/<start>/<count>")]
async fn match_list(
    puuid: String,
    start: String,
    count: String,
) -> Result<Json<String>, JsonErr<ResultErr>> {
    let url = format!("https://sea.api.riotgames.com/lol/match/v5/matches/by-puuid/{puuid}/ids?start={start}&count={count}&api_key={RIOT_API_DEV}");

    get(&url).await
}

#[get("/matchDetails/<match_id>")]
async fn match_details(match_id: String) -> Result<Json<String>, JsonErr<ResultErr>> {
    let url = format!(
        "https://sea.api.riotgames.com/lol/match/v5/matches/{match_id}?api_key={RIOT_API_DEV}"
    );

    get(&url).await
}

#[launch]
fn rocket() -> _ {
    rocket::build().mount(
        "/api/riot",
        routes![summoner, lol_by_summoner, match_list, match_details],
    )
}

async fn get(url: &str) -> Result<Json<String>, JsonErr<ResultErr>> {
    match reqwest::get(url).await {
        Ok(res) => match res.text().await {
            Ok(res) => Ok(Json(res)),
            Err(_) => Err(JsonErr(ResultErr::NotFound, Status::NotFound)),
        },
        Err(_) => Err(JsonErr(ResultErr::NotFound, Status::NotFound)),
    }
}
