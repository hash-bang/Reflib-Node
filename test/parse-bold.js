var expect = require('chai').expect;
var fs = require('fs');
var rl = require('../index');

describe('Testing bolding', function() {
	var resErr, resCount = 0, resCountCalled = 0;
	var sampleData = {};

	before(function(next) {
		this.timeout(60 * 1000);
		rl.parseFile(__dirname + '/data/bold.xml', {
			fixes: {
				authors: true,
				dates: true,
				pages: true,
			},
		})
			.on('error', function(err) {
				resErr = err;
				next();
			})
			.on('ref', function(ref) {
				resCountCalled++;
				if (ref.pages == '340-347') {
					sampleData['homework'] = ref;
				} else if (ref.isbn == '1530-5627') {
					sampleData['patient-satisfaction'] = ref;
				} else if (ref.isbn == '2352-3964') {
					sampleData['bowel-disease'] = ref;
				}
			})
			.on('end', next);
	});

	it('should not raise an error', function() {
		expect(resErr).to.be.not.ok;
	});

	it('end count should be accurate', function() {
		expect(resCountCalled).to.equal(3);
	});

	it('should return random sample (homework)', function() {
		var sample = sampleData['homework'];
		expect(sample).to.be.ok;
		expect(sample).to.have.property('title', 'Homework Completion via Telephone and In-Person Cognitive Behavioral Therapy Among Latinos');
		expect(sample).to.have.property('abstract', 'Homework completion in cognitive behavioral therapy (CBT) for deression is an integral ingredient in treatment that often goes unreported. Furthermore, many studies of homework completion focus on patient adherence without considering the therapists’ role in reviewing and reinforcing this behavior. No studies to date have assessed the relationship between homework variables and outcomes among Latinos receiving CBT for depression. Since this population has often been difficult to engage in CBT, this study aims to assess whether homework completion and therapist review of homework are related to improved outcomes in a CBT intervention (telephone or in person) for Latinos with depression. We found that higher homework completion was significantly related to lower depression scores at the end of final treatment (as measured by PHQ-9) (B = − 1.38, p &lt;.01). However, the significant association of homework with depression went away when clinician review of homework was included in a subsequent step of the model (B = − 0.42, p =.45). The number of times a clinician actively reviewed homework was still significantly related to a decrease in PHQ-9 when controlling for demographic factors (B = − 1.23, p &lt;.01). This study found that homework is a predictor of improved outcomes in CBT for depression but highlights the role of therapists reviewing homework as a predictor of lower depression symptoms among Spanish speaking Latinos from low socioeconomic backgrounds.');
	});


	it('should return random sample (patient-satisfaction)', function() {
		var sample = sampleData['patient-satisfaction'];
		expect(sample).to.be.ok;
		expect(sample).to.have.property('title', 'Telephone Consultation as a Substitute for Routine Out-patient Face-to-face Consultation for Children With Inflammatory Bowel Disease: Randomised Controlled Trial and Economic Evaluation');
		expect(sample).to.have.property('abstract', 'Background: Evidence for the use of telephone consultation in childhood inflammatory bowel disease (IBD) is lacking. We aimed to assess the effectiveness and cost consequences of telephone consultation compared with the usual out-patient face-to-face consultation for young people with IBD. Methods: We conducted a randomised-controlled trial in Manchester, UK, between July 12, 2010 and June 30, 2013. Young people (aged 8-16. years) with IBD were randomized to receive telephone consultation or face-to-face consultation for 24. months. The primary outcome measure was the paediatric IBD-specific IMPACT quality of life (QOL) score at 12 months. Secondary outcome measures included patient satisfaction with consultations, disease course, anthropometric measures, proportion of consultations attended, duration of consultations, and costs to the UK National Health Service (NHS). Analysis was by intention to treat. This trial is registered with ClinicalTrials.gov, number NCT02319798. Findings: Eighty six patients were randomised to receive either telephone consultation (n = 44) or face-to-face consultation (n = 42). Baseline characteristics of the two groups were well balanced. At 12 months, there was no evidence of difference in QOL scores (estimated treatment effect in favour of the telephone consultation group was 5.7 points, 95% CI - 2.9 to 14.3; p = 0.19). Mean consultation times were 9.8. min (IQR 8 to 12.3) for telephone consultation, and 14.3. min (11.6 to 17.0) for face-to-face consultation with an estimated reduction (95% CI) of 4.3 (2.8 to 5.7) min in consultation times (p &lt; 0.001). Telephone consultation had a mean cost of UK£35.41 per patient consultation compared with £51.12 for face-face consultation, difference £15.71 (95% CI 11.8-19.6; P. &lt; 0.001). Interpretation: We found no suggestion of inferiority of telephone consultation compared with face-to-face consultation with regard to improvements in QOL scores, and telephone consultation reduced consultation time and NHS costs. Telephone consultation is a cost-effective alternative to face-to-face consultation for the routine outpatient follow-up of children and adolescents with IBD. Funding: Research for Patient Benefit Programme, UK National Institute for Health Research.');
	});


	it('should return random sample (bowel-disease)', function() {
		var sample = sampleData['bowel-disease'];
		expect(sample).to.be.ok;
		expect(sample).to.have.property('title', 'Patient satisfaction with physician-patient communication during telemedicine');
		expect(sample).to.have.property('abstract', 'The quality of physician-patient communication is a critical factor in treatment outcomes and patient satisfaction with care. To date, few studies have specifically conducted an in-depth evaluation of the effect of telemedicine (TM) on physician-patient communication in a medical setting. Our objective was to determine whether physical separation and technology used during TM have a negative effect on physician-patient communication. In this noninferiority randomized clinical trial, patients were randomized to receive a single consultation with one of 9 physicians, either in person (IP) or via TM. Patients (n = 221) were recruited from pulmonary, endocrine, and rheumatology clinics at a Midwestern Veterans Administration hospital. Physician-patient communication was measured using a validated self-report questionnaire consisting of 33 items measuring satisfaction with visit convenience and physician&apos;s patient-centered communication, clinical competence, and interpersonal skills. Satisfaction for physician&apos;s patient-centered communication was similar for both consultation types (TM = 3.76 versus IP = 3.61), and noninferiority of TM was confirmed (noninferiority t-test p = 0.002). Patient satisfaction with physician&apos;s clinical competence (TM = 4.63 versus IP = 4.52) and physician&apos;s interpersonal skills (TM = 4.79 versus IP = 4.74) were similar, and noninferiority of TM was confirmed (noninferiority t-test p = 0.006 and p = 0.04, respectively). Patients reported greater satisfaction with convenience for TM as compared to IP consultations (TM = 4.41 versus IP = 2.37, noninferiority t-test p &lt; 0.001). Patients were equally satisfied with physician&apos;s ability to develop rapport, use shared decision making, and promote patient-centered communication during TM and IP consultations. Our data suggest that, despite physical separation, physician-patient communication during TM is not inferior to communication during IP consultations.');
	});
});
