const sgMail=require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail=(email,name)=>{
    sgMail.send({
        to:email,
        from:'ZiadAhmedShawky123@gmail.com',
        subject:'Thank you for joining us',
        text:`Welcome to our task app ${name},we wish to be happy with us`
    })
}

const sendCancelationEmail=(email,name)=>{
    sgMail.send({
        to:email,
        from:'ZiadAhmedShawky123@gmail.com',
        subject:'Sorry to see you go',
        text:`GoodBye, ${name}.I hope to see you back sometime soon`
    })
}

module.exports={
    sendWelcomeEmail,
    sendCancelationEmail
}