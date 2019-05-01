import React, { Component } from 'react';
import axios from 'axios';
import _ from 'lodash';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = { 
      insightsData: []
    }
  }

  componentDidMount(){
    let self = this;

    let url = '/sites/api_service/Insights/GetAuthorArticles?authorName=' + this.state.authorName + '&numRecords=5&segment=34';
    let url1 = '/sites/api_service/Insights/GetAuthorArticles?authorName=Birse_Andrew&numRecords=10&segment=56';
    let url2 = '/sites/api_service/Insights/GetAuthorArticles?authorName=Ali_Tawhid&numRecords=10&segment=56';

    // let url1 = 'http://methodeabcom.staging.acml.com/sites/api_service/Insights/GetAuthorArticles?authorName=Birse_Andrew&numRecords=10&segment=56';
    // let url2 = 'http://methodeabcom.staging.acml.com/sites/api_service/Insights/GetAuthorArticles?authorName=Ali_Tawhid&numRecords=10&segment=56';

    var Promise = require("es6-promise");
    Promise.polyfill();

    const promise1 = axios.get(url1);
    const promise2 = axios.get(url2);

    //var insightsArr = [];
    Promise.all([promise1, promise2]).then(function(values) {
      //console.log(values);
      var arr1 = values[0].data.InsightsResults.Records;
      var arr2 = values[1].data.InsightsResults.Records;
      var merged = arr1;

      // arr2.map((post)=>{  
      //   if (arr1.indexOf(post) ==-1){
      //     arr1.push(post);
      //   }
      // })
    
      merged = merged.slice(0,6);
 
     self.setState({insightsData: merged});
    });

  }

  displayResults(start,end){

    return this.state.insightsData.slice(start,end).map(function(item, index){
        return  (
          <div className="col--12 col--sm-6 col--md-4 col--lg-4" key={item.GUID}>
              <a href={item.Url} target="_self">
                {item.ContentTypes == "Video" ? <div className="abl--video-img"><img className="contained" src={item.HeroImage !=="" ? `http://www.alliancebernstein.com${item.HeroImage}` : `http://www.alliancebernstein.com${item.Tile1Image}`} alt="" /><div className="abl--video-icon"></div></div> : <img className="contained" src={item.HeroImage !=="" ? `http://www.alliancebernstein.com${item.HeroImage}` : `http://www.alliancebernstein.com${item.Tile1Image}`} alt="" /> }
                <h3>{item.Headline}</h3>
                <p className="abl--insights-date">{item.PublishedDateString} | {item.InsightType}</p>
                <p>{item.Teaser}</p>
              </a>
          </div>
      )
    })
  }



  render() {
        return (
          <div className="col--12 col--sm-12 col--md-10 col--md-offset-1">
            <div className="relative">
                <h2 className="abl--padded-b">Insights</h2>
                <a href="/sites/financial-intermediary/uk/insights.htm" className="abl--button abl--button-square-teal-border btn-pull-right">See All Insights</a>
            </div>
            <div className="abl--row insights--3-row abl--padded-b">
            {this.displayResults(0,3)}
            </div>
            <div className="abl--row insights--3-row abl--padded-b">
            {this.displayResults(3,6)}
            </div>
          </div>
              
        );

  }
}

export default App;
