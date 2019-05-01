import React, { Component } from 'react';
import axios from 'axios';
import _ from 'lodash';

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
    authors.map(name =>{
      urls.push(`http://methodeabcom.staging.acml.com/sites/api_service/Insights/GetAuthorArticles?authorName=${encodeURIComponent(name)}&numRecords=10&segment=56`);
    });
    // authors.map(name =>{
    //   urls.push(`/sites/api_service/Insights/GetAuthorArticles?authorName=${encodeURIComponent(name)}&numRecords=10&segment=56`);
    // });
    
    //create promises
    for (let i=0; i < urls.length; i++){
      promises.push(axios.get(urls[i])); 
    }

    var Promise = require("es6-promise");
    Promise.polyfill();
    //wait for all promises to resolve and get the results
    Promise.all(promises).then(function(values) {
      var arr1 = values[0].data.InsightsResults.Records;
      var arr2 = values[1].data.InsightsResults.Records;
      var joined = arr1.concat(arr2);

      //remove duplicates
      var merged = _.uniqWith(joined, _.isEqual);
      //var merged = self.removeDuplicateObjects(joined, 'GUID')

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

  //display posts from requested start and end index, ex. display post from 0 to 3
  displayResults(start, end){
    return this.state.insightsData.slice(start,end).map(function(item){
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

  //display 3 posts in each row
  displayThreePerRow(numRows){
    var data = [];
    var start = 0;
    for (let i =0; i < numRows; i++){      
       data.push( 
       <div className="abl--row insights--3-row abl--padded-b" key={`row${i}`}>
          {this.displayResults(start, start+3)}
        </div>
       );
       start = start+3;
    }
    return data;
  }

  render() {
      return (
        <div className="col--12 col--sm-12 col--md-10 col--md-offset-1">
          <div className="relative">
              <h2 className="abl--padded-b">Insights</h2>
              <a href="javascript:void(0)" className="abl--button abl--button-square-teal-border btn-pull-right">See All Insights</a>
          </div>
          {this.displayThreePerRow(2)}
        </div>
            
      );

  }
}

export default App;
