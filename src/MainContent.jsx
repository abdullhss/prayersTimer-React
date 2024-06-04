import React, { useEffect, useState } from 'react'
import "./mainContentStayle.css"
import Grid from '@mui/material/Unstable_Grid2';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Card from './Card';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import axios from 'axios'
import moment from 'moment';
export default function MainContent() {
    

    const [timeopj , setTimeopj] = useState({});
    
    const [date, setDate] = useState("");
    
    const [salah, setSalah] = useState({});
    
    const [remainingTimeToNextPraye , setRemainingTimeToNextPraye ] = useState("");
    
    const [city , setCity] = useState({display : "القاهرة" , APIname : "Cairo"});
    
    //setTimeopj(data.data.timings)
    const getTiming = async ()=>{
        const data = await axios.get(`https://api.aladhan.com/v1/timingsByCity/03-06-2024?country=EG&city=${city.APIname}`) ;
        setTimeopj(data.data.data.timings)
    }
    useEffect(()=>{
        getTiming() ;
    } , [city])


    useEffect(()=>{
        const timeNow = moment() ;
        setDate(timeNow.format("MMM Do YYYY | h:mm"))
        
        let interval = setInterval(() => {
            countDown();
        }, 1000);

        return () =>{
            clearInterval(interval);
        }
    }, [salah] ); 


    function countDown(){
        const timeNow = moment() ;
        let salahNow = null ; 
        if(timeNow.isAfter(moment(timeopj.Fajr , "hh:mm"))   &&  timeNow.isBefore(moment(timeopj.Dhuhr , "hh:mm")) ){
            setSalah({display : "الظهر" , APIname:"Dhuhr"})
        }
        else if(timeNow.isAfter(moment(timeopj.Dhuhr , "hh:mm"))   &&  timeNow.isBefore(moment(timeopj.Asr, "hh:mm")) ){
            setSalah({display : "العصر" , APIname:"Asr"})
        }
        else if(timeNow.isAfter(moment(timeopj.Asr , "hh:mm"))   &&  timeNow.isBefore(moment(timeopj.Maghrib, "hh:mm")) ){
            setSalah({display : "المغرب" , APIname:"Maghrib"})
        }
        else if(timeNow.isAfter(moment(timeopj.Maghrib , "hh:mm"))   &&  timeNow.isBefore(moment(timeopj.Isha, "hh:mm")) ){
            setSalah({display : "العشاء" , APIname:"Isha"})
        }
        else{
            setSalah({display : "الفجر" , APIname:"Fajr"})
        }
        salahNow = salah.APIname ;
        // timeopj[salahNow] time of nwxt salah 
        let remainingTime =  moment(timeopj[salahNow] , "hh:mm").diff(timeNow) ; 
        if(remainingTime < 0){
            let midTime = moment("23:59:59" ,"hh:mm:ss").diff(timeNow);
            let fjerToMidNight = moment(timeopj[salahNow] , "hh:mm").diff(moment("00:00:00" , "hh:mm:ss"))
            let totoal = midTime + fjerToMidNight ;
            remainingTime = totoal ; 
        }

        let durationTime = moment.duration( remainingTime ) ;
        setRemainingTimeToNextPraye(` ${durationTime.seconds()}: ${durationTime.minutes()} : ${durationTime.hours()}`) ;
    }

    const handleChange = (event) => {
        console.log(event.target.value);
        setCity(event.target.value);
    };

return (
    <>
        <Grid container>
            <Grid xs={6}>
                <div>
                    <h3>{date}</h3>
                    <h1>{city.display}</h1>
                </div>
            </Grid>
            <Grid xs={6}>
                <div>
                    <h3>متبقي حتى صلاة {salah.display}</h3>
                    <h1>{remainingTimeToNextPraye}</h1>
                </div>
            </Grid>
        </Grid>
        <Divider variant="middle" id='divider'/>
        
        <Grid container spacing={2} id="card">
      <Grid item xs={12} sm={6} md={6} lg={2.4}>
        <Card name = "الفجر" time = {timeopj.Fajr} image={"https://th.bing.com/th?id=OIF.R8b1Dt1k%2fGuTJGv8UlGXSA&rs=1&pid=ImgDetMain"}/>
      </Grid>
      <Grid item xs={12} sm={6} md={6} lg={2.4}>
        <Card name = "الظهر" time = {timeopj.Dhuhr} image={"https://th.bing.com/th/id/OIP.dmhkPluOY7ibKUM9aHYj7AHaE7?rs=1&pid=ImgDetMain"} />
      </Grid>
      <Grid item xs={12} sm={6} md={6} lg={2.4}>
        <Card name = "العصر" time ={timeopj.Asr} image={"https://th.bing.com/th/id/R.0fdc5fe506dcb1f03d00f8f309195b3c?rik=xNmnRFLUoc1RAQ&riu=http%3a%2f%2f1.bp.blogspot.com%2f-XDCTJVr7cXU%2fUJIyf-qfLrI%2fAAAAAAAAAYM%2fMfs0ng1RN7I%2fs1600%2fWaqifMosqueDaytime.jpg&ehk=rVGIAwH0udU%2bnsUapoMmCd5dYdX8hqv53T3DZrA2KYw%3d&risl=&pid=ImgRaw&r=0"}/>
      </Grid>
      <Grid item xs={12} sm={6} md={6} lg={2.4}>
        <Card name = "المغرب" time ={timeopj.Maghrib} image={"https://aquila-style.com/wp-content/uploads/2020/02/Islamic-Centre-of-America--scaled.jpg"}/>
      </Grid>
      <Grid item xs={12} sm={6} md={6} lg={2.4}>
        <Card name = "العشاء" time ={timeopj.Isha} image={"https://th.bing.com/th/id/OIP.TxGIa4g8ruLDsZ8EU7xOmQHaE7?rs=1&pid=ImgDetMain"}/>
      </Grid>
    </Grid>

        <Stack direction={'row'} id="stackStyle">
        <FormControl fullWidth id="select">
        <InputLabel id="demo-simple-select-label">المدينة</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          label="المدينة"
          onChange={handleChange}
        >
          <MenuItem value={{display : "بور سعيد" , APIname:"Port said"}}>بور سعيد</MenuItem>
          <MenuItem value={{ display : "القاهرة",APIname : "Cairo"}}>القاهرة</MenuItem>
          <MenuItem value={{display : "الاسكندرية" , APIname : "Alexandria"}}>الاسكندرية</MenuItem>
        </Select>
      </FormControl>
        </Stack>
    </>
  )
}
// https://api.aladhan.com/v1/timingsByCity/03-06-2024?country=EG&city=Cairo       API