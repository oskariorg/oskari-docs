# GetAnalysisData (GET)
This action route returns properties of one requested analyse

## Parameters
<table>
  <tr>
    <th>Name</th>
    <th>Type</th>
    <th>Description</th>
    <th>Required?</th>
  </tr>
  <tr>
    <td>analyse_id</td>
    <td>String</td>
    <td>Analyse id of one analyse (id in analysis table.</td>
    <td>**true**</td>
  </tr>
</table>

## Response

### Success
```javascript
{
  "analysisdata": [
    {
    // row1 data
    },
    {
    // row22 data
    }
  ],
  analysis_id: id
}
```

### Error
Returns HTTP code 200 with an error message as a string in response body.
Empty result returns "{}".


## Examples

### Example query for Paikkatietoikkuna
http://localhost:8080/web/fi/kartta?p_p_id=Portti2Map_WAR_portti2mapportlet&p_p_lifecycle=2&&action_route=GetAnalysisData&analyse_id=1456

Response:
```javascript
{
    "analysisdata": [{
        "postinumero": "00170",
        "fi_osoite": "Pohjoisesplanadi 11-13",
        "fi_nimi": "Helsingin kaupunki"
    }, {
        "postinumero": "00100",
        "fi_osoite": "Mikonkatu 7",
        "fi_nimi": "Uudenmaan TE-toimisto, Helsinki / Kluuvi"
    }, {
        "postinumero": "00120",
        "fi_osoite": "Uudenmaankatu 16",
        "fi_nimi": "Uudenmaan TE-toimisto, Helsinki / Kamppi"
    }, {
        "postinumero": "00100",
        "fi_osoite": "Salomonkatu 17",
        "fi_nimi": "Kela, Helsinki / Kamppi"
    }, {
        "postinumero": "00120",
        "fi_osoite": "Erottajankatu 2",
        "fi_nimi": "Suomen tulli, pääkonttori"
    }, {
        "postinumero": "00180",
        "fi_osoite": "Tyynenmerenkatu 8",
        "fi_nimi": "Helsingin tulli, Länsisatama / Länsiterminaali L4"
    }, {
        "postinumero": "00180",
        "fi_osoite": "Salmisaarenranta 7",
        "fi_nimi": "Helsingin hovioikeus"
    }, {
        "postinumero": "00130",
        "fi_osoite": "Fabianinkatu 15",
        "fi_nimi": "Korkein hallinto-oikeus"
    }, {
        "postinumero": "00170",
        "fi_osoite": "Pohjoisesplanadi 3",
        "fi_nimi": "Korkein oikeus"
    }, {
        "postinumero": "00180",
        "fi_osoite": "Porkkalankatu 13",
        "fi_nimi": "Helsingin käräjäoikeus"
    }, {
        "postinumero": "00100",
        "fi_osoite": "Pohjoisesplanadi 11 - 13",
        "fi_nimi": "Helsingin yhteispalvelupiste"
    }, {
        "postinumero": "00180",
        "fi_osoite": "Porkkalankatu 13",
        "fi_nimi": "Helsingin oikeusaputoimisto, Helsingin toimipaikka"
    }, {
        "postinumero": "00180",
        "fi_osoite": "Albertinkatu 25",
        "fi_nimi": "Helsingin maistraatti"
    }],
    "analyse_id": 1456
}