export class MgaConfigScreen {

    MgaName = {
        required: 'MGA Name Required.'
       
    }
    Description = {
        required: 'Description Required'
    }

    Zip = {
        required: 'Zip Required.',  
        lenth : 'Zip Code must be 5 characters.'     
    }

    City= {
        required: 'City Required.'
    }

    State= {
        required: 'State Required.'
    }
    
    StreetAddress = {
        required: 'Street Address Required.',
        space: 'Street Address Required.'
    }

    PrimaryContact= {
        required: 'Primary Contact Required.'
       
    }

    EmailAddress = {
        required: 'Email  Required.',
        valid: 'Email must be a valid email address.',
        pattern : 'Email is not valid.'
     
    } 
    
    Phone= {
        required: 'Phone  Required.',
        format: 'Phone is not valid'
    }

    Fax = {
        required: 'Fax  Required.',
        format: 'Fax is not valid'
    }  

}