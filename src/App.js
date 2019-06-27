import React, { Component } from 'react';
import axios from 'axios';
import _ from 'lodash';
// import './resources/css/main.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = { 
      insightsData: [],
      authorNames: document.getElementById('authorsDataElement').getAttribute('data-names')
    }
  }

  componentDidMount(){
    let self = this;
    let authors = this.state.authorNames.split(",");
    let urls = [];
    let promises = [];
    //localhost
    // authors.map(name =>{
    //   urls.push(`http://methodeabcom.staging.acml.com/sites/api_service/Insights/GetAuthorArticles?authorName=${encodeURIComponent(name)}&numRecords=10&segment=56`);
    // });

    //prod
    authors.map(name =>{
      urls.push(`/sites/api_service/Insights/GetAuthorArticles?authorName=${encodeURIComponent(name)}&numRecords=10&segment=56`);
    });
    
    //create promises
    for (let i=0; i < urls.length; i++){
      promises.push(axios.get(urls[i])); 
    }

    //a promise to pull records by category. Add to the array of promises
    //prod
    promises.push(axios.get('/sites/api_service/Insights/GetTopicsResults?numRecords=5&insightCategory=Economic+Perspectives'));
    //localhost
    //promises.push(axios.get('http://methodeabcom.staging.acml.com/sites/api_service/Insights/GetTopicsResults?numRecords=5&insightCategory=Economic+Perspectives'));
    console.log(promises);

    var Promise = require("es6-promise");
    Promise.polyfill();
    //wait for all promises to resolve and get the results
    Promise.all(promises).then(function(values) {
      console.log(`values from inside promises: ${values[0].data.InsightsResults.Records}`);
      // var arr1 = values[0].data.InsightsResults.Records;

      var joined = [];
      for (let i=0; i < values.length; i++){
        joined.push(values[i].data.InsightsResults.Records);
      }
      console.log(`joined: ${joined}`);
      //concatinate all results into one array. First parameter in apply function says to concat to empty array
      joined = Array.prototype.concat.apply([], joined);
      console.log(joined);
      //remove duplicates
      var merged = _.uniqWith(joined, _.isEqual);
      //var merged = self.removeDuplicateObjects(joined, 'GUID')
      console.log(merged);
      //sort by date
      merged = self.sortByKey(merged, 'PublishedDateObj');
      merged = merged.reverse();
      self.setState({insightsData: merged});
    });
  }

  sortByKey(array, key){
    return array.sort(function(a, b){
      var keyA = new Date(a[key]),
          keyB = new Date(b[key]);
        // Compare the 2 dates
        if(keyA < keyB) return -1;
        if(keyA > keyB) return 1;
        return 0;
    });
  }

  removeDuplicateObjects(originalArray, prop){ 
    var newArray = [];
    var lookupObject = {};

    for (var i in originalArray){
      lookupObject[originalArray[i][prop]] = originalArray[i];
      //created lookupObj = {guid:object, guid:object}
      //when it encounters the obj with existing guid prop it is overriden by the second occurence
    }

    for (i in lookupObject){
      newArray.push(lookupObject[i]);
    }
    return newArray;
  }

  //display posts from requested start and end index, ex. display posts from 0 to 6
  displayResults(){
    return this.state.insightsData.slice(0,6).map(function(item){
        return  (
          <div className="fcol--1 fcol--sm-2 fcol--md-2 fcol--lg-3" key={item.GUID}>
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
              <a href="/financial-intermediary/uk/insights.htm" className="abl--button abl--button-square-teal-border btn-pull-right">See All Insights</a>
          </div>
          <div className="abl--flex insights--3-row abl--padded-b">
            {this.displayResults()}
          </div>
        </div>
            
      );

  }
}

export default App;
