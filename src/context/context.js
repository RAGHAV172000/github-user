import React, { useState, useEffect, Children } from 'react';
import mockUser from './mockData.js/mockUser';
import mockRepos from './mockData.js/mockRepos';
import mockFollowers from './mockData.js/mockFollowers';
import axios from 'axios';

const rootUrl = 'https://api.github.com';


const GithubContext=React.createContext();

const GithubProvider=({children})=>{
	const [githubUser,setGithubUser]=useState(mockUser); 
	const [repos,setRepos]=useState(mockRepos); 
	const [followers,setFollowers]=useState(mockFollowers); 
	const [requests,setRequests]=useState(0);
	const [loading,setIsLoading]=useState(false);
	const [error,setError]=useState({show:false,msg:''})
	const checkRequests=()=>{
		axios(`${rootUrl}/rate_limit`).then(({data})=>{
			// console.log(data);
			let {rate:{remaining}}=data;
			// remaining=0;
			setRequests(remaining);
			if(remaining===0)
			{
				toggleError(true,'sorry you have use your all request')
			}
		}).catch((err)=>console.log(err));
	}
	const SearchGithubUser=async(user)=>{
		// console.log(user);
		setIsLoading(true);
    const response = await axios(`${rootUrl}/users/${user}`).catch((err) =>
      console.log(err)
    );
    if (response) {
      setGithubUser(response.data);
      const { login, followers_url } = response.data;

      await Promise.allSettled([
        axios(`${rootUrl}/users/${login}/repos?per_page=100`),
        axios(`${followers_url}?per_page=100`),
      ])
        .then((results) => {
          const [repos, followers] = results;
          const status = 'fulfilled';
          if (repos.status === status) {
            setRepos(repos.value.data);
          }
          if (followers.status === status) {
            setFollowers(followers.value.data);
          }
        })
        .catch((err) => console.log(err));
    } else {
      toggleError(true, 'there is no user with that username');
    }
    checkRequests();
    setIsLoading(false);
	}
	useEffect(()=>{
		checkRequests();
		// searchGithubUser(user);  
		// console.log("loded");
	},[])
	const toggleError=(show,msg)=>{
		setError({show,msg});
	}
	
	return (<GithubContext.Provider value={{githubUser,repos,followers,requests,error,SearchGithubUser,loading }}>{children}</GithubContext.Provider>)
}

export {GithubContext,GithubProvider}