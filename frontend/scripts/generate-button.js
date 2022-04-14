// GenerateButton class to help with generating buttons for a choice in html
// Can generate and return a button

export {GenerateButton}

class GenerateButton{
    constructor(buttonclass='generic-button', buttonid='generic-button', buttontype = 'button', buttoninternal='generic button'){
        this.buttonclass = buttonclass;
        this.buttonid = buttonid;
        this.buttontype = buttontype;
        this.buttoninternal = buttoninternal;
    }

    showInfo(){
        for(let i = 0; i < 4; i++){
            console.log(GenerateButton);
            //console.log(Object.keys(GenerateButton));
        }
    }
    



}