jQuery(document).ready(function ($) {
    $("#government").click(function () {
        $(".whatwecando-text").fadeOut(function () {
            $(".whatwecando-text").html("<h3> On the federal level, the US Department of Health and Human Services (HHS) is focusing on: </h3>" +
                "<p> 1. Improving access to treatment and recovery services. </p>" +
                "<p> 2. Promoting use of overdose-reversing drugs. </p>" +
                "<p> 3. Strengthening our understanding of the epidemic through better public health surveillance. </p>" +
                "<p> 4. Providing support for cutting-edge research on pain and addiction. </p>" +
                "<p> 5. Advancing better practices for pain management.</p>" +
                "</br>" +

                "<h3> The National Institutes of Health (NIH) - a component of HHS has recently (2017) met with pharmaceutical companies and academic research centers to explore:</h3>" +
                "<p> 1. Safe, effective, non-addictive strategies to manage <a href='https://www.drugabuse.gov/related-topics/pain'> chronic pain </a> </p>" +
                "<p> 2. <a href='https://www.drugabuse.gov/publications/research-reports/medications-to-treat-opioid-addiction/overview'> New, innovative medications and technologies to treat opioid use disorders </a> </p>" +
                "<p> 3. Improved <a href='https://www.drugabuse.gov/related-topics/opioid-overdose-reversal-naloxone-narcan-evzio'> overdose prevention and reversal interventions </a> to save lives and support recovery </p>"
            ).fadeIn();
        })
    })
});

jQuery(document).ready(function ($) {
    $("#state").click(function () {
        $(".whatwecando-text").fadeOut(function () {
            $(".whatwecando-text").html("<h3> Large efforts are being initiated by the Department of Public Health in Massachusetts to address the crisis. These efforts include: </h3>" +
                "<p> 1. Stopping Stigma: DPH launched the State Without StigMA campaign to encourage the public to rethink how they perceive and treat people with addiction.</p>" +
                "<p> 2. Promoting the Good Samaritan Law: a law that ensures a person won’t be charged with possession of a controlled substance if they call 9-1-1 to report an overdose. </p>" +
                "<p> 3. Prescription Monitoring Reforms: DPH launched the Massachusetts Prescription Awareness Tool (MassPAT) to help pharmacists and doctors better monitor active opioid prescriptions </p>" +
                "<p> 4. Expanding Prescription Drug Training: more resources and programs have been offered to dental schools and nursing and physician assistant programs to train students and professionals on how to prevent prescription drug misuse. </p>"
           ).fadeIn();
        })
    })
});
