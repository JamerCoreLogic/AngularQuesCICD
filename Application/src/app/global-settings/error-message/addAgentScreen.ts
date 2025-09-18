export class AddAgentScreen {
    FirstName = {
        required: 'First Name Required.',       
        pattern: 'One Space Allowed Between Words.',
        lenth: 'Fifty Character is Allowed'
    }
    Middlename = {
        required: 'Middle Name Required.',       
        pattern: 'One Space Allowed Between Words.',
    }

    LastName = {
        required: 'Last Name Required.',       
        pattern: 'One Space Allowed Between Words.',
    }

    Email = {
        required: 'Email Address Required.',
        valid: 'Email must be a valid email address.',
        pattern : 'Email is not valid.'
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

    PhoneCell  ={
        required: 'Phone Cell Required.',
        pattern : 'Phone Cell is not valid.'
    }

    PhoneOffice  ={
        pattern : 'Phone Office is not valid.'
    }

    PhoneHome  ={
        pattern : 'Phone Home is not valid.'
    }

    Fax = {
        pattern : 'Fax is not valid.'
    }

    Role = {
        required : 'Role Required.'
    }  

    Agencyname = {
        required : 'Agency Name Required.'
    }

    Supervisor = {
        required : 'Supervisor Required.'
    }

    Manager = {
        required : 'Manager Required.'
    }
    Lob={
        required : 'LOB Required.'
    }
}