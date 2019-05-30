let url = "https://cachimbogo-flask.herokuapp.com";


export default function GetData(dir,data,flag) {
    let urlTemp;
    return new Promise((resolve, reject) => {
        if(flag){
            urlTemp=url;
           // console.log(`${urlTemp}/${dir}/${data}`);
        }else{
            urlTemp=url;
           // console.log(`${urlTemp}/${dir}/${data}`);
        }
        fetch(`${urlTemp}/${dir}${data}`)
            .then(response => { return (response.json()) })
            .then(responseJson => {
                resolve(responseJson)
            })
            .catch((error) => {
                reject(error);
            });
    })
}
