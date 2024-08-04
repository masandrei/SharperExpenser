class DataHelper
{
    static formatTimeString(time)
    {
        let formattedTime = "";
        //Format hours
        formattedTime += time.getHours() > 9 ? time.getHours() : `0${time.getHours()}`;
        formattedTime += ":";
        //Format minutes
        formattedTime += time.getMinutes() < 10 ? `0${time.getMinutes()}` : time.getMinutes();
        return formattedTime
    }
}

export default DataHelper;