// GenerateButton class to help with generating buttons for a choice in html
// Can generate and return button(s)

export {GenerateButton}

class GenerateButton{
    constructor(buttonclass='generic-button', buttonid='generic-button', buttontype = 'button', buttoninternal='generic button'){
        this.buttonclass = buttonclass;
        this.buttonid = buttonid;
        this.buttontype = buttontype;
        this.buttoninternal = buttoninternal;
    }

    // set html button properties when wanting to generate a html button
    setHTMLButtonProperties(buttonclass, buttonid, buttontype, buttoninternals){
        this.buttonclass = buttonclass;
        this.buttonid = buttonid;
        this.buttontype = buttontype;
        this.buttoninternal = buttoninternals;
    }

    // generate and return a set html button
    generateHTMLButton(){
        let finalizedbutton = '<button' + 
                              ' class=' + this.buttonclass + 
                              ' id=' + this.buttonid + 
                              ' type=' + this.buttontype +
                              '>' + this.buttoninternal +
                              '</button>';
        return finalizedbutton;
    }
}