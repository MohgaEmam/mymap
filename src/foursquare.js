const clientid = 'HL5YB0ABIRIKUIO5FFTJD2PA3QNPUMUSKT0RZCZ5TQLE45UN'
const clientsecret = 'ILCK3VMC5VTYVWDCYTVKVQSPDH532LSQ4HSXOMHJIQD3FKJM'
const v = '20180805'
const ll = "30.0083745,31.2149558"
const radius = "1000"
const categories = {

    Spa: "4bf58dd8d48988d1ed941735"
  
}
const catid = Object.keys(categories).map((catorgry) => categories[catorgry]);

export const locations = (maps) => {

    const mapurl =
        `${'https://api.foursquare.com/v2/venues/'}search?ll=${maps.lat},${maps.lng}&client_id=${clientid}&client_secret=${clientsecret}&v=${v}&categoryId=${catid}&radius=${radius}&limit=50`
    return fetch(mapurl)
        .then(output => {
            if (output.ok === false) {
                throw output
            } else { return output.json() }
    })
  .then(info => {
      const loca = info.output.venues;
      console.log(loca.length)

      const daloca = loca.filter( place => place.location.address && place.location.city && place.location.city === "Cairo");
          daloca ;
          return daloca;
 

  })

}

export const details = (foursquareid) => {


  const daurl = `${'https://api.foursquare.com/v2/venues/'}${foursquareid}?client_id=${clientid}&client_secret=${clientsecret}&v=${v}`
  return fetch(daurl)
      .then(data => {
          if (data.ok === false) {
              throw data
          } else { return data.json() }
    })
}
