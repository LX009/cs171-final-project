jQuery(document).ready(function ($) {
    $("#government").click(function () {
        $(".whatwecando-text").fadeOut(function () {
            $(".whatwecando-text").html(`<h3 style="font-style: normal; font-weight: 400;">US Department of Health and Human Services</h3>` +
                `<p><i>HHS focuses on five priorities.</i><p>` +
                `<p>1. Improve access to treatment and recovery services. </p>` +
                `<p>2. Promote overdose-reversing drugs. </p>` +
                `<p>3. Track and analyze crisis data. </p>` +
                `<p>4. Support cutting-edge addiction research. </p>` +
                `<p>5. Advance better practices for pain management.</p>`
                ).fadeIn();
        })
    })
});

jQuery(document).ready(function ($) {
    $("#state").click(function () {
        $(".whatwecando-text").fadeOut(function () {
            $(".whatwecando-text").html(`<h3 style="font-style: normal; font-weight: 400;">Massachusetts Department of Public Health</h3>` +
                `<p><i>DPH initiatives include:</i></p>` +
                `<p> 1. The <a href="https://www.mass.gov/state-without-stigma">"State Without StigMA"</a> campaign encourages the public to reconsider assumptions about addiction.</p>` +
                `<p> 2. <a href="https://www.aaos.org/AAOSNow/2014/Jan/managing/managing3/?ssopc=1">Good Samaritan Laws</a> encourage people to report overdoses by ensures they won't be charged with substance possession. </p>` +
                `<p> 3. The <a href="https://www.mass.gov/additional-pmp-information">Massachusetts Prescription Awareness Tool</a> helps pharmacists and doctors monitor active opioid prescriptions. </p>` +
                `<p> 4. Prescription Drug Training provides professional schools with drug abuse prevention materials.  </p>`
            ).fadeIn();
        })
    })
});

jQuery(document).ready(function ($) {
    $("#local").click(function () {
        $(".whatwecando-text").fadeOut(function () {
            $(".whatwecando-text").html(
                `<h3 style="font-style: normal; font-weight: 400;">The National Institutes of Health</h3>` +
                `<p><i>This division of HHS performs research on:</i>` +
                `<p>1. Safe, effective, non-addictive strategies to manage <a href='https://www.drugabuse.gov/related-topics/pain'> chronic pain. </a> </p>` +
                `<p>2. <a href='https://www.drugabuse.gov/publications/research-reports/medications-to-treat-opioid-addiction/overview'> Innovative medications and technologies to treat opioid use disorders. </a> </p>` +
                `<p>3. Improved <a href='https://www.drugabuse.gov/related-topics/opioid-overdose-reversal-naloxone-narcan-evzio'> overdose prevention and reversal interventions </a> to save lives and support recovery </p>`
            ).fadeIn();
        })
    })
});
