const downloadFile = (myData) => {
    //const { myData } = state; // I am assuming that "this.state.myData"
                                   // is an object and I wrote it to file as
                                   // json
  
    // create file in browser
    const fileName = "SaveFile";
    const json = JSON.stringify(myData, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const href = URL.createObjectURL(blob);
  
    // create "a" HTLM element with href to file
    const link = document.createElement("a");
    link.href = href;
    link.download = fileName + ".json";
    document.body.appendChild(link);
    link.click();
  
    // clean up "a" element & remove ObjectURL
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
}
export default downloadFile;