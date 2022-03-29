import React, {useState, useEffect} from 'react';
import { TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import AuthService from './../components/AuthService';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import MUILink from '@mui/material/Link';

let Auth = new AuthService();

const getAllItems = async (type, endpoint) => {
    const result = await fetch(`/${type}/${endpoint}`,{
        method:"GET",
        headers: {
            'Authorization': `Bearer ${Auth.getToken()}`,
        },
    })
    .then(function (response) {
        return response.json();
    }).then((response) => {
        return response;
    });
    return result
}


const DeleteAction = async (Id, controller, endpoint) => {
    return await fetch(`/${controller}/${endpoint}`, {
        method: "DELETE",
        mode: "cors",
        headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${Auth.getToken()}`,
        },
        body: Id
      })
      .then(function (response) {
        console.log(response);
        return response.json();
      }).then((response) => {
        console.log(response);
        return response;
      });
}


const handleOnSelect = (e, value, setObject) => {
    setObject(value)
 }

 const handleDeleteItem = async (e, setObjectList, setObject, refresh, setRefresh, props) => {
     const response = await DeleteAction(e, props.type, props.endpointAction);
     console.log(response);
     const List = await getAllItems(props.type, props.endpointList);
     setObjectList(List); 
     setObject({Id:0, [props.renderKey]: ""});
     setRefresh(!refresh)
 }




function DeleteObject ({ children, ...rest }) {
    const [objectList, setObjectList] = useState([]);
    const [object, setObject] = useState({Id:0, [rest.renderKey]: ""});
    const [refresh, setRefresh] = useState(false);


    const handleInputChange = (e, value = "", setObject) => {
        setObject({Id:0, [rest.renderKey]: value});
    }

    //Only called once because of empty array
    useEffect( async () => {
        const List = await getAllItems(rest.type, rest.endpointList);
        setObjectList(List);    
     }, []);

  return (
   <div>
       <Breadcrumbs aria-label="breadcrumb" className="breadcrumbs">
            <MUILink onClick={() => rest.history.push('/')}>
                Forside
            </MUILink>
            <MUILink onClick={() => rest.history.push('/dashboard')}>
                Dashboard
            </MUILink>
            <Typography color="text.primary">{rest.title}</Typography>
        </Breadcrumbs>
       <h5>{rest.title}</h5>
       <Autocomplete
            id="combo-box-demo"
            key={refresh}
            onChange={(event, value) => handleOnSelect(event, value, setObject)}
            onInputChange={(event,value) => handleInputChange(event, value, setObject)}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            inputValue={object[rest.renderKey]}
            options={objectList}
            getOptionLabel={(option) => option[rest.renderKey]}
            style={{ width: 300 }}
            renderInput={(params) => 
            <TextField {...params} label={rest.title} variant="outlined" />}
        />
        <Button id="delete-button" variant="contained" size="large" onClick={async () => {await handleDeleteItem(object.Id, setObjectList, setObject, refresh, setRefresh, rest)}}>
                    Slet
        </Button>
   </div>
  )
  }
  export default DeleteObject;