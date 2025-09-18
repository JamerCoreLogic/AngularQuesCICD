export class NewAgencyScreen {
    AgencyName = {
        required: 'Agency Name Required.',       
        whitespace: 'Agency Name Required.',
    }
  
   Zip = {
        required: 'Zip Code Required.', 
        lenth : 'Zip Code must be 5 characters.'      
    }

    City= {
        required: 'City Required.'
    }

    State= {
        required: 'State Required.'
    }
    
    StreetAddress= {
        required: 'Street Address Required.'
    }

    StreetAddress2= {
        required: 'Street Address Required.',
        whitespace: 'Street Address Required.',
    }

    PrimaryContact  ={
        required: 'Primary Contact Required.'
    }

    EmailAddress= {
        required: 'Email Address Required.',
        valid: 'Email must be a valid email address.',
        pattern : 'Email is not valid.'
    }

    Fax = {
        format: 'Fax is not valid'
    }

    Phone= {
        required: 'Phone Required.',
        format: 'Phone is not valid'
    }

    LicenseExp= {
        required: 'License Expiration Date Required'
    }   

    License= {
        required: 'License Required'
    }  
  
}