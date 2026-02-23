# Expungement.Legal Knowledge Base
*(Add any documentation, FAQs, or process details here. The chatbot will automatically use this information to answer user questions.)*

## Frequently Asked Questions

### What is the difference between Expunction and Nondisclosure in Texas?
Expunction completely removes the offense from your criminal record, as if it never happened. You can legally deny the arrest occurred. Nondisclosure seals the record from public view (like landlords or private employers), but law enforcement and some state agencies can still see it.

### How long does the process take?
Our standard processing typically takes 90 to 120 days, but it can take longer depending on the court. We offer rush processing for an expedited timeline. The difference in speed between rush and standard could be anywhere from 30 to 90 days. If you really need to clear your record in less time, we strongly suggest you choose expedited. We will place your petition in the front of our queue and get your petition filed before any of our standard petitions.

### How much does it cost?
- **Standard Processing**: $1,395
- **Rush Processing**: $2,000
We offer interest-free payment plans. If we determine we cannot file your petition after reviewing your case, we provide a money-back guarantee.

### Do I have to go to court?
No. Our attorneys handle everything, including filing the paperwork and attending any required hearings on your behalf.

## V2 Knowledge Base

Texas Criminal Record Clearing: Comprehensive Master Knowledgebase for Automated Eligibility Systems (2025–2026)
Introduction to the Algorithmic Framework of Texas Record Clearing
The Texas criminal justice system imposes strict procedural and temporal frameworks governing the management, sealing, and destruction of criminal history records. For automated legal eligibility systems, mastering this architecture requires a definitive, programmatic understanding of three interdependent statutory domains: the rules governing the total destruction of records (Expunction under Chapter 55A of the Code of Criminal Procedure), the rules governing the sealing of records from public view (Nondisclosure under Chapter 411 of the Government Code), and the strict temporal boundaries that dictate when prosecutorial jurisdiction expires (Statutes of Limitations under Chapter 12 of the Code of Criminal Procedure).
This master document establishes the definitive operational logic for Texas record clearing as of the 2025–2026 legislative landscape. The 88th and 89th Legislative Sessions enacted sweeping modernizations, most notably the transition of expunction laws from Chapter 55 to the newly structured Chapter 55A. Furthermore, the 89th Legislature aggressively altered the statute of limitations for complex financial crimes, real property deed theft, and offenses against vulnerable populations, thereby fundamentally shifting the wait times required for expunction eligibility.
Crucially, this knowledgebase serves to strictly demarcate enacted, active law from proposed legislation that failed to pass. Automated systems must be programmed to avoid logic based on dead or pending legislation, such as the proposed expansions to nondisclosure eligibility, ensuring all outputs rely solely on finalized, codified Texas statutes.
Jurisprudential Distinctions: Expunction versus Nondisclosure
The mechanisms of record clearing in Texas are bifurcated into two distinct legal remedies. An automated system must first classify the ultimate disposition of a criminal charge to determine which of these two pathways is legally appropriate.
Expunction (Destruction of Records)
Governed by Chapter 55A of the Texas Code of Criminal Procedure, an expunction represents the ultimate legal remedy. It is a court-ordered process that mandates the physical destruction, deletion, or return of all records and files relating to an arrest, charge, or court proceeding. Upon the finalization of an expunction order, the underlying incident is treated in the eyes of the law as if it never occurred. The individual is granted the statutory right to deny the occurrence of the arrest and the existence of the expunction order itself, except when testifying in a criminal proceeding under oath.
The operational reach of an expunction is absolute. Government entities, including the Texas Department of Public Safety (DPS), local law enforcement agencies, county clerks, and prosecutorial offices, are strictly prohibited from maintaining, releasing, or utilizing the records. Furthermore, private background check companies that aggregate data from state repositories are legally compelled to obliterate the data from their systems upon receipt of the order. Because of its absolute nature, expunction is generally reserved for instances where the state failed to prove guilt or declined to pursue the case. This includes acquittals, pardons based on actual innocence, cases where charges were never formally filed, and dismissals where the statute of limitations has conclusively expired.
Order of Nondisclosure (Sealing of Records)
Governed by Chapter 411, Subchapter E-1 of the Texas Government Code, an order of nondisclosure does not destroy a criminal record; rather, it seals the record from general public access. While private employers, landlords, and the general civilian public cannot view a sealed record during standard background checks, the record remains intact and fully accessible to criminal justice agencies, law enforcement, and specific state licensing and regulatory boards (such as the State Board of Educator Certification, the Texas Medical Board, and the Texas Racing Commission).
Nondisclosure is a conditional relief typically granted to individuals who have accepted responsibility for a crime but successfully completed a rehabilitative period, such as deferred adjudication community supervision, or who have acquired a first-time, low-level misdemeanor conviction. While the individual may legally deny the offense to civilian entities, they must disclose it when applying for certain professional licenses, government employment, or law enforcement positions.
Phase I: Global Pre-Screening and Absolute Disqualifiers
Before an eligibility algorithm calculates wait times or evaluates procedural pathways, the system must subject the petitioner’s entire lifetime criminal history to a global audit. Texas law imposes absolute, non-negotiable prohibitions on record clearing for individuals with specific types of criminal histories.
The Government Code 411.074 Lifetime Ban
The most formidable barrier in Texas record clearing is the lifetime ban codified in Texas Government Code Section 411.074. This statute dictates that an individual is permanently ineligible for an order of nondisclosure—for any offense, regardless of how minor the target offense may be—if their criminal history contains a conviction or deferred adjudication for specific severe offenses. This disqualification applies retroactively and prospectively across the individual's entire lifespan.
Statutory Reference
Description of Permanently Disqualifying Offense
Algorithmic Impact
CCP Chapter 62
Any offense requiring registration as a sex offender.
Permanent Bar to all Nondisclosures
Penal Code 19.02 / 19.03
Murder and Capital Murder.
Permanent Bar to all Nondisclosures
Penal Code 20.04
Aggravated Kidnapping.
Permanent Bar to all Nondisclosures
Penal Code 20A.02 / 20A.03
Trafficking of Persons and Continuous Trafficking of Persons.
Permanent Bar to all Nondisclosures
Penal Code 22.04 / 22.041
Injury to a Child, Elderly, or Disabled Individual; Abandoning/Endangering a Child.
Permanent Bar to all Nondisclosures
Penal Code 25.07 / 25.072
Violation of Court Orders/Bond in Family Violence, Sexual Assault, or Stalking Cases.
Permanent Bar to all Nondisclosures
Penal Code 42.072
Stalking.
Permanent Bar to all Nondisclosures
Family Code 71.004
Any offense involving Family Violence (including affirmative findings).
Permanent Bar to all Nondisclosures
The family violence prohibition operates with extreme rigor. Under Texas law, if an offense involved domestic violence, the court will often enter an "affirmative finding of family violence" into the judgment. Even if a defendant successfully completes deferred adjudication for a misdemeanor domestic assault and the case is legally dismissed, the affirmative finding permanently tethers that charge to the individual. This renders not only that specific charge unsealable but also preempts the sealing of any other eligible charges the individual may acquire in the future.
The Criminal Episode Rule (Expunction Restriction)
While Section 411.074 governs nondisclosures, Chapter 55A imposes a strict global condition on expunctions known as the "Criminal Episode Rule." Under Article 55A.151, a court may not order the expunction of records relating to an arrest if the arrest arose out of a "criminal episode" (a single continuous arrest event or transaction) and the individual was convicted of, or remains subject to prosecution for, at least one other offense occurring during that exact same episode.
For operational logic, if a defendant is arrested simultaneously for Possession of a Controlled Substance and Unlawfully Carrying a Weapon, and the drug charge is dismissed but the weapon charge results in a final conviction, the drug charge cannot be expunged. The conviction on the secondary charge permanently anchors the shared arrest record in the public domain, as the state will not redact an arrest report that rightfully establishes a lawful conviction.
Intervening Offenses and the "Clean Period" Rule
For nondisclosure petitions relying on Government Code Sections 411.0725, 411.073, or 411.0735, the algorithm must verify a "Clean Period." During the requisite waiting period following the completion of their sentence or probation, the petitioner must not be convicted of or placed on deferred adjudication for any new offense, excluding minor fine-only traffic offenses under the Transportation Code. A subsequent offense committed during the waiting period permanently revokes eligibility for the underlying charge.
Validation of Deprecated Rules (Logic Exclusions)
An accurate eligibility bot must be programmed to avoid applying obsolete rules or proposed legislation that failed to become law.
First, the historical "Five-Year Felony Bar" for expunctions has been deprecated. Previously, courts could deny an expunction for a dismissed case if the petitioner had been convicted of a felony in the five years preceding the arrest. During the transition to the modern Chapter 55A framework, this broad provision permitting the consideration of any unrelated felony conviction within five years was deleted. The primary restriction on expunction related to other convictions is now strictly limited to the Criminal Episode Rule. Automated systems must not deny expunction eligibility based on unrelated prior felony convictions.
Second, the system must not implement logic from failed 89th Legislature bills. Senate Bill 219 proposed radical changes to Government Code 411, seeking to automate all nondisclosures through a monthly DPS audit and repeal all filing fees. Similarly, House Bill 2708 sought to remove the strict "never previously convicted" requirement for sealing misdemeanor convictions. Legislative records verify that both SB 219 and HB 2708 failed to pass and were left pending in committee. Consequently, the strict first-offender "One-and-Done" requirement remains the active, prevailing law for sealing convictions in 2026, and nondisclosure petitions still require standard filing procedures and fees unless otherwise exempted.
Phase II: Chapter 55A Expunction Architecture (2025–2026)
The expunction framework dictates the temporal and procedural requirements for legally destroying records. House Bill 4504 achieved a massive nonsubstantive recodification, entirely repealing Chapter 55 and creating Chapter 55A to modernize terminology and layout, effective January 1, 2025. Subsequent legislation in the 89th Session layered substantive procedural enhancements onto this new foundation.
Modernization of Procedures (SB 1667 and SB 537)
Prior to 2025, expunction proceedings were frequently delayed by manual certified mailings and highly variable, localized county fees. Senate Bill 1667, effective September 1, 2025, fundamentally modernized this logistical process. The bill mandates that electronic service of expunction petitions and orders to state agencies is entirely free of charge to the petitioner. It standardizes a minimal $25 fee per entity only in rare cases where non-electronic service is strictly required. Furthermore, SB 1667 permits court clerks to retain expunction orders indefinitely, solving a critical historical issue where petitioners lost their physical orders and could not verify their expunged status after the clerk destroyed the case file.
However, SB 1667 strictly exempts certain federal mental health records (specifically federal prohibited person information under Government Code 411.052) from destruction. This ensures that critical data preventing firearm purchases by legally disqualified individuals is retained and kept confidential by the court, even if the underlying criminal case is expunged.
Simultaneously, Senate Bill 537, also effective September 1, 2025, created powerful financial incentives for rehabilitative justice. It mandates the waiver of all expunction filing fees for individuals who successfully complete specialized diversionary programs. This includes Veterans Treatment Courts (Government Code 124), Mental Health Court Programs (Government Code 125), and authorized pretrial intervention programs under Government Code 76.011.
Algorithmic Expunction Pathways
Eligibility for expunction under Chapter 55A generally routes through four distinct algorithmic categories:
Disposition Type
Expunction Eligibility Trigger
Statutory Basis
Acquittal / Actual Innocence
Immediate. Trial court must advise defendant and may enter order within 30 days.
Art. 55A.002, 55A.003
Class C Deferred Adjudication
Immediate upon successful completion and discharge.
Art. 55A.051
Unfiled Arrests (No Charges)
Expiration of standard wait period (180 days Class C, 1 year Class A/B, 3 years Felony) OR Prosecutor Certification.
Art. 55A.052
Dismissed Charges (Filed)
Expiration of the Statute of Limitations for the underlying offense.
Art. 55A.053
Pathway 1: Acquittals and Actual Innocence If a defendant goes to trial and is found "Not Guilty" by a judge or jury, they are entitled to an immediate expunction. Chapter 55A provides a streamlined, automatic mechanism wherein the trial court is obligated to advise the defendant of this right and can enter the order within 30 days of the acquittal without requiring a separate civil lawsuit. Similarly, a pardon based on actual innocence grants an immediate entitlement to expunction.
Pathway 2: Class C Deferred Adjudication The sole exception to the universal rule that deferred adjudication precludes expunction applies exclusively to Class C misdemeanors (fine-only offenses, such as minor traffic violations or public intoxication). Successful completion of a Class C deferred adjudication results in a dismissal that is treated as immediately eligible for an expunction petition.
Pathway 3: Unfiled Arrests If an individual is arrested but the prosecutor declines to present an indictment or information, the individual must wait for the expiration of a statutory waiting period from the date of arrest. These default periods are 180 days for Class C misdemeanors, 1 year for Class A or B misdemeanors, and 3 years for all felonies. Alternatively, an expunction may be granted prior to these deadlines if the prosecuting attorney formally certifies that the records are no longer necessary for any ongoing criminal investigation.
Pathway 4: Dismissed Charges and the SOL Dependency If formal charges were filed but subsequently dismissed or quashed, the petitioner generally must wait until the Statute of Limitations (SOL) for the underlying offense has completely expired. The expiration of the SOL ensures the state is procedurally barred from re-filing the charges, representing finality in the case.
There are highly specific exceptions to the SOL wait time for dismissals. The law permits a petitioner to bypass the rigorous SOL waiting period if the dismissal was the direct result of completing an authorized pretrial intervention program, a veterans treatment court, or a mental health court, or if the indictment was deemed legally void due to false information, mistaken identity, or a lack of probable cause. Absent these specific diversionary programs, calculating the exact expiration of the statute of limitations is the core algorithmic requirement for determining dismissal eligibility.
Phase III: The Statute of Limitations Matrix (CCP Chapter 12)
The Texas Code of Criminal Procedure Chapter 12 defines the maximum time allowable between the commission of an offense and the presentment of an indictment or information. Satisfying the statute of limitations means the state has "presented" the charging instrument to the court, thereby stopping the clock.
The 89th Legislative Session aggressively expanded these temporal windows to address modern forensic realities and the rise of sophisticated, deeply concealed financial crimes. An automated eligibility system must cross-reference the offense type against these updated timelines to calculate the exact date a dismissal becomes eligible for expunction.
Offenses with No Statute of Limitations
Under Article 12.01(1), the state of Texas has determined that certain egregious offenses may be prosecuted at any point in perpetuity. Consequently, an arrest for these crimes, if dismissed without prejudice, can theoretically never be expunged via the SOL pathway, as the state's right to prosecute never officially expires.
Offense Category
Statutory Reference
Nature of the Exception
Murder & Manslaughter
Art. 12.01(1)(A)
Covers all criminal homicides under PC Chapter 19.
Severe Sexual Assaults
Art. 12.01(1)(B)
Aggravated sexual assaults under PC 22.011 / 22.021.
Serial Sexual Offenses
Art. 12.01(1)(C)(ii)
Probable cause exists of similar offenses against 5+ victims.
DNA Exception Cases
Art. 12.01(1)(C)(i)
Biological matter collected but untested or unmatched.
Child Sexual Abuse
Art. 12.01(1)(D/E)
Continuous abuse (PC 21.02) and Indecency with a Child.
Fatal Hit and Run
Art. 12.01(1)(F)
Leaving the scene of a collision resulting in death.
Human Trafficking
Art. 12.01(1)(G/H)
High-level and continuous trafficking of persons.
The Ten-Year Limitation Tier: The SB 16 Deed Theft Expansion
The 10-year limitation tier (Article 12.01(2)) generally applies to severe felonies involving a breach of fiduciary duty, forgery, arson, and select non-forensic sexual assaults.
A landmark development in the 89th Session was the passage of Senate Bill 16, effective September 17, 2025. Driven by an epidemiological surge in sophisticated property scams targeting the aging population, SB 16 created the new Penal Code offenses of "Real Property Theft" (PC 31.23) and "Real Property Fraud" (PC 32.60). Real property crimes are uniquely damaging because victims often do not realize their home's title has been fraudulently transferred until years later when attempting to sell, inhabit, or mortgage the property.
Recognizing that standard theft limitations were vastly inadequate for these clandestine crimes, the legislature explicitly elevated real property theft and fraud to the 10-year limitation tier. By doing so, the state ensures prosecutors possess a decade-long investigative window to unravel complex, multi-jurisdictional deed fraud networks. For an eligibility bot, any dismissal for PC 31.23 or 32.60 must enforce a strict 10-year wait from the date of the offense.
The Seven-Year Limitation Tier: The SB 2798 Fraud Overhaul
Prior to 2025, financial crimes operated under a fractured patchwork of limitations that hampered law enforcement. Senate Bill 2798, effective September 1, 2025, centralized and overhauled the prosecution of fraud. Acknowledging that financial perpetrators utilize sophisticated concealment methods that delay discovery, and that financial investigations demand time-intensive subpoena cycles for out-of-state banking records, the legislature imposed a uniform seven-year statute of limitations for virtually all fraud offenses.
Under the revised Article 12.01(3), the 7-year limitation now strictly applies to:
General Chapter 32 Fraud Offenses (including Credit Card/Debit Card Abuse, False Statement to Obtain Credit, and Identity Theft).
Money Laundering.
Medicaid and Health Care Fraud.
Bigamy (provided no minor is involved).
Felony Tax Code Violations.
Crucial Algorithmic Note on Non-Retroactivity: SB 2798 includes a strict non-retroactivity provision. If an older fraud offense became barred by its previous, shorter limitation period (e.g., the old 3-year or 5-year limits) before September 1, 2025, it remains forever barred, and the individual is eligible for expunction based on the old timeline. The new 7-year limit applies exclusively to cases that were still legally active and unexpired as of the effective date.
The Five-Year and Three-Year Default Tiers
The 5-year limit acts as the baseline for standard felony property crimes and violent offenses that do not trigger higher enhancements. This includes Standard Theft, Robbery, Kidnapping, Burglary, and Insurance Fraud.
Any felony not explicitly enumerated in the higher tiers defaults to a standard 3-year limitation under Article 12.01(11) (the catch-all tier). This encompasses standard drug possession offenses, non-aggravated assaults, and tampering with government records.
Notably, this catch-all tier encompasses the newly created Penal Code 21.03—"Continuous Sexual Abuse"—enacted in 2025. While continuous abuse against a child or disabled person (PC 21.02) carries no limitation, the legislature did not explicitly add the new adult-focused PC 21.03 to the "no limitation" list. Consequently, continuous sexual abuse against adults currently operates under this highly restrictive 3-year limitation window.
Misdemeanor Limitations
Article 12.02 dictates that for most Class A, B, and C misdemeanors (including first-time DWI, petty theft, and marijuana possession), the state must present charges within a strict 2-year window from the date of the offense.
The primary exception is for Misdemeanor Assault involving Family Violence. Acknowledging the cyclical nature of domestic abuse, the psychological control exerted by abusers, and the frequency of delayed reporting or initial victim reluctance, the legislature extended the limitation for family violence assaults to 3 years.
Discovery Rules and Victim-Age Extensions (Tolling the Clock)
For offenses involving professional concealment or violations of public trust, the limitation clock does not begin on the date the crime was committed, but rather on the date it is discovered. Senate Bill 127, effective September 1, 2025, drastically altered the framework for mandatory reporters. Under the updated Family Code 261.109(c), a professional's "Failure to Report Child Abuse or Neglect" is now subject to a discovery rule. A State Jail Felony failure to report allows 4 years from discovery, while a Class A Misdemeanor allows 3 years from discovery. This ensures that professionals (such as teachers and physicians) cannot escape liability simply because the underlying abuse remained successfully hidden until the standard limitation period expired.
To protect minors, Texas law heavily tolls the statute of limitations until the victim reaches the age of majority. For offenses such as Injury to a Child (10 years from the 18th birthday), Trafficking of a Child (20 years from the 18th birthday), and Sexual Performance by a Child (20 years from the 18th birthday), the state maintains prosecutorial jurisdiction well into the victim's adulthood. An arrest for these offenses will remain ineligible for SOL-based expunction for decades.
Phase IV: Chapter 411 Nondisclosure Architecture (2025–2026)
For records that cannot be legally destroyed via expunction—primarily because the defendant was placed on deferred adjudication or was convicted of a minor offense—an Order of Nondisclosure offers a mechanism to seal the record.
To accurately assess nondisclosure eligibility, the algorithm must identify the correct statutory pathway based on the case disposition and enforce the precise waiting period required by law. The waiting period clock universally begins on the date of official discharge, dismissal, or completion of the sentence.
Deferred Adjudication Community Supervision Pathways
If a defendant successfully completes deferred adjudication and the case is dismissed, they avert a final conviction and are generally eligible for sealing, provided the offense is not barred by the 411.074 lifetime exclusions.
Statutory Pathway
Offense Type
Required Waiting Period Post-Discharge
Gov't Code 411.072
Standard Non-Violent Misdemeanors.
Immediate. Court must grant automatically upon discharge.
Gov't Code 411.0725
Serious Misdemeanors (Penal Code Chapters 20–46).
2 Years. Includes non-family assault, weapons, indecency.
Gov't Code 411.0725
Eligible Felony Offenses.
5 Years.
Gov't Code 411.0726
DWI Deferred Adjudication (With Interlock).
2 Years. Requires 6 months of interlock usage.
Gov't Code 411.0726
DWI Deferred Adjudication (No Interlock).
5 Years.
Section 411.072 provides an automatic sealing mechanism for first-time, non-violent misdemeanor deferred adjudications that occurred after September 1, 2017. If eligible, the judge is statutorily required to issue the nondisclosure order at the time of discharge without requiring a formal petition or waiting period. All other deferred adjudications must route through the petition-based 411.0725 or 411.0726 pathways, enforcing the 2-year or 5-year waiting periods.
First-Time Misdemeanor Convictions (The Second Chance Laws)
Texas law strictly prohibits the sealing of felony convictions. However, the state permits the sealing of actual final convictions for first-time misdemeanor offenses. The system must enforce the "One-and-Done" rule: the petitioner must have never been previously convicted of or placed on deferred adjudication for any other offense (excluding fine-only traffic tickets) in their entire lifetime.
Statutory Pathway
Offense / Sentence Type
Required Waiting Period Post-Completion
Gov't Code 411.073
Misdemeanor Conviction with Probation.
Immediate. Or 2 years if a Chapter 20-46 serious misdemeanor.
Gov't Code 411.0735
Misdemeanor Conviction with Jail Time (No Probation).
2 Years following completion of sentence.
Gov't Code 411.0731
First-Time DWI Conviction with Probation.
2 Years (with interlock) or 5 Years (no interlock).
Gov't Code 411.0736
First-Time DWI Conviction with Jail Time.
3 Years following completion of sentence.
The DWI conviction sealing pathways (411.0731 and 411.0736) are governed by highly specific criteria. The individual's Blood Alcohol Concentration (BAC) must have been below 0.15, the incident must not have involved an accident with another person, and the individual must have absolutely no prior criminal record of any kind.
Algorithmic Output Generation: The Logic Tree
To synthesize the myriad of legislative updates, overlapping statutes, and procedural waiting periods into a functional output for a legal compliance bot, the system must process user data through five sequential gates.
Step 1: The Global Disqualification Audit The system scans the user's entire lifetime history against Gov't Code 411.074. If the history contains any conviction or deferred adjudication for a listed serious offense (Murder, Sex Crimes, Trafficking, Aggravated Kidnapping) or carries an affirmative finding of Family Violence, the system flags the user as Permanently Ineligible for any nondisclosure. Concurrently, it checks the Criminal Episode Rule: if an arrest resulted in a secondary conviction, that specific arrest is Permanently Ineligible for expunction.
Step 2: Disposition Classification
The system classifies the specific target charge:
Path A (Acquittal, Pardon, Class C Deferred): Route directly to Immediate Expunction Eligibility.
Path B (Dismissed without Probation): Route to Expunction SOL Evaluation.
Path C (Deferred Adjudication - Misd/Felony): Route to Nondisclosure Wait Time Evaluation.
Path D (Conviction - Misdemeanor): Execute the "One-and-Done" absolute clean history verification. If true, route to Nondisclosure Wait Time Evaluation.
Path E (Conviction - Felony): Flag as Permanently Ineligible for relief.
Step 3: Temporal Evaluation (The Wait Times)
For Path B (Dismissals), the system pulls the arrest date and adds the updated Chapter 12 limitations: +10 years for Deed Theft (SB 16), +7 years for Chapter 32 Fraud (SB 2798), +3 years for standard felonies, +3 years for family violence misdemeanors, or +2 years for standard misdemeanors. If the current date surpasses the calculated date, the status updates to Expunction Eligible.
For Paths C and D (Nondisclosures), the system pulls the discharge date and adds the 411 framework requirements (+0, +2, +3, or +5 years based on offense grade, probation vs. jail time, and interlock usage).
Step 4: The Clean Period Cross-Check
For any nondisclosure relying on a waiting period, the system verifies that no new convictions or deferred adjudications occurred between the probation start date and the calculated eligibility open date. If a violation is found, the status updates to Ineligible due to Intervening Offense.
Step 5: Output Construction
The bot must generate a standardized response detailing:
Current Status: (Eligible, Ineligible, or Waiting).
Legal Reason: Briefly citing the rule (e.g., "Barred by Criminal Episode Rule CCP 55A.151" or "Wait period met under Gov't Code 411.0725").
Key Dates: If they are waiting, providing the exact date eligibility opens based on the SOL or discharge calculations.
Next Steps: Advising whether a Petition for Nondisclosure or an Ex Parte Petition for Expunction is required.
By rigidly adhering to this codified logic, automated systems can navigate the intricate, highly consequential landscape of Texas record clearing, ensuring absolute statutory compliance while dynamically accounting for the sweeping legislative modernizations of the 2025 and 2026 sessions.


## V2 Knowledge Base

Texas Criminal Record Clearing: Comprehensive Master Knowledgebase for Automated Eligibility Systems (2025–2026)
Introduction to the Algorithmic Framework of Texas Record Clearing
The Texas criminal justice system imposes strict procedural and temporal frameworks governing the management, sealing, and destruction of criminal history records. For automated legal eligibility systems, mastering this architecture requires a definitive, programmatic understanding of three interdependent statutory domains: the rules governing the total destruction of records (Expunction under Chapter 55A of the Code of Criminal Procedure), the rules governing the sealing of records from public view (Nondisclosure under Chapter 411 of the Government Code), and the strict temporal boundaries that dictate when prosecutorial jurisdiction expires (Statutes of Limitations under Chapter 12 of the Code of Criminal Procedure).
This master document establishes the definitive operational logic for Texas record clearing as of the 2025–2026 legislative landscape. The 88th and 89th Legislative Sessions enacted sweeping modernizations, most notably the transition of expunction laws from Chapter 55 to the newly structured Chapter 55A. Furthermore, the 89th Legislature aggressively altered the statute of limitations for complex financial crimes, real property deed theft, and offenses against vulnerable populations, thereby fundamentally shifting the wait times required for expunction eligibility.
Crucially, this knowledgebase serves to strictly demarcate enacted, active law from proposed legislation that failed to pass. Automated systems must be programmed to avoid logic based on dead or pending legislation, such as the proposed expansions to nondisclosure eligibility, ensuring all outputs rely solely on finalized, codified Texas statutes.
Jurisprudential Distinctions: Expunction versus Nondisclosure
The mechanisms of record clearing in Texas are bifurcated into two distinct legal remedies. An automated system must first classify the ultimate disposition of a criminal charge to determine which of these two pathways is legally appropriate.
Expunction (Destruction of Records)
Governed by Chapter 55A of the Texas Code of Criminal Procedure, an expunction represents the ultimate legal remedy. It is a court-ordered process that mandates the physical destruction, deletion, or return of all records and files relating to an arrest, charge, or court proceeding. Upon the finalization of an expunction order, the underlying incident is treated in the eyes of the law as if it never occurred. The individual is granted the statutory right to deny the occurrence of the arrest and the existence of the expunction order itself, except when testifying in a criminal proceeding under oath.
The operational reach of an expunction is absolute. Government entities, including the Texas Department of Public Safety (DPS), local law enforcement agencies, county clerks, and prosecutorial offices, are strictly prohibited from maintaining, releasing, or utilizing the records. Furthermore, private background check companies that aggregate data from state repositories are legally compelled to obliterate the data from their systems upon receipt of the order. Because of its absolute nature, expunction is generally reserved for instances where the state failed to prove guilt or declined to pursue the case. This includes acquittals, pardons based on actual innocence, cases where charges were never formally filed, and dismissals where the statute of limitations has conclusively expired.
Order of Nondisclosure (Sealing of Records)
Governed by Chapter 411, Subchapter E-1 of the Texas Government Code, an order of nondisclosure does not destroy a criminal record; rather, it seals the record from general public access. While private employers, landlords, and the general civilian public cannot view a sealed record during standard background checks, the record remains intact and fully accessible to criminal justice agencies, law enforcement, and specific state licensing and regulatory boards (such as the State Board of Educator Certification, the Texas Medical Board, and the Texas Racing Commission).
Nondisclosure is a conditional relief typically granted to individuals who have accepted responsibility for a crime but successfully completed a rehabilitative period, such as deferred adjudication community supervision, or who have acquired a first-time, low-level misdemeanor conviction. While the individual may legally deny the offense to civilian entities, they must disclose it when applying for certain professional licenses, government employment, or law enforcement positions.
Phase I: Global Pre-Screening and Absolute Disqualifiers
Before an eligibility algorithm calculates wait times or evaluates procedural pathways, the system must subject the petitioner’s entire lifetime criminal history to a global audit. Texas law imposes absolute, non-negotiable prohibitions on record clearing for individuals with specific types of criminal histories.
The Government Code 411.074 Lifetime Ban
The most formidable barrier in Texas record clearing is the lifetime ban codified in Texas Government Code Section 411.074. This statute dictates that an individual is permanently ineligible for an order of nondisclosure—for any offense, regardless of how minor the target offense may be—if their criminal history contains a conviction or deferred adjudication for specific severe offenses. This disqualification applies retroactively and prospectively across the individual's entire lifespan.
Statutory Reference
Description of Permanently Disqualifying Offense
Algorithmic Impact
CCP Chapter 62
Any offense requiring registration as a sex offender.
Permanent Bar to all Nondisclosures
Penal Code 19.02 / 19.03
Murder and Capital Murder.
Permanent Bar to all Nondisclosures
Penal Code 20.04
Aggravated Kidnapping.
Permanent Bar to all Nondisclosures
Penal Code 20A.02 / 20A.03
Trafficking of Persons and Continuous Trafficking of Persons.
Permanent Bar to all Nondisclosures
Penal Code 22.04 / 22.041
Injury to a Child, Elderly, or Disabled Individual; Abandoning/Endangering a Child.
Permanent Bar to all Nondisclosures
Penal Code 25.07 / 25.072
Violation of Court Orders/Bond in Family Violence, Sexual Assault, or Stalking Cases.
Permanent Bar to all Nondisclosures
Penal Code 42.072
Stalking.
Permanent Bar to all Nondisclosures
Family Code 71.004
Any offense involving Family Violence (including affirmative findings).
Permanent Bar to all Nondisclosures
The family violence prohibition operates with extreme rigor. Under Texas law, if an offense involved domestic violence, the court will often enter an "affirmative finding of family violence" into the judgment. Even if a defendant successfully completes deferred adjudication for a misdemeanor domestic assault and the case is legally dismissed, the affirmative finding permanently tethers that charge to the individual. This renders not only that specific charge unsealable but also preempts the sealing of any other eligible charges the individual may acquire in the future.
The Criminal Episode Rule (Expunction Restriction)
While Section 411.074 governs nondisclosures, Chapter 55A imposes a strict global condition on expunctions known as the "Criminal Episode Rule." Under Article 55A.151, a court may not order the expunction of records relating to an arrest if the arrest arose out of a "criminal episode" (a single continuous arrest event or transaction) and the individual was convicted of, or remains subject to prosecution for, at least one other offense occurring during that exact same episode.
For operational logic, if a defendant is arrested simultaneously for Possession of a Controlled Substance and Unlawfully Carrying a Weapon, and the drug charge is dismissed but the weapon charge results in a final conviction, the drug charge cannot be expunged. The conviction on the secondary charge permanently anchors the shared arrest record in the public domain, as the state will not redact an arrest report that rightfully establishes a lawful conviction.
Intervening Offenses and the "Clean Period" Rule
For nondisclosure petitions relying on Government Code Sections 411.0725, 411.073, or 411.0735, the algorithm must verify a "Clean Period." During the requisite waiting period following the completion of their sentence or probation, the petitioner must not be convicted of or placed on deferred adjudication for any new offense, excluding minor fine-only traffic offenses under the Transportation Code. A subsequent offense committed during the waiting period permanently revokes eligibility for the underlying charge.
Validation of Deprecated Rules (Logic Exclusions)
An accurate eligibility bot must be programmed to avoid applying obsolete rules or proposed legislation that failed to become law.
First, the historical "Five-Year Felony Bar" for expunctions has been deprecated. Previously, courts could deny an expunction for a dismissed case if the petitioner had been convicted of a felony in the five years preceding the arrest. During the transition to the modern Chapter 55A framework, this broad provision permitting the consideration of any unrelated felony conviction within five years was deleted. The primary restriction on expunction related to other convictions is now strictly limited to the Criminal Episode Rule. Automated systems must not deny expunction eligibility based on unrelated prior felony convictions.
Second, the system must not implement logic from failed 89th Legislature bills. Senate Bill 219 proposed radical changes to Government Code 411, seeking to automate all nondisclosures through a monthly DPS audit and repeal all filing fees. Similarly, House Bill 2708 sought to remove the strict "never previously convicted" requirement for sealing misdemeanor convictions. Legislative records verify that both SB 219 and HB 2708 failed to pass and were left pending in committee. Consequently, the strict first-offender "One-and-Done" requirement remains the active, prevailing law for sealing convictions in 2026, and nondisclosure petitions still require standard filing procedures and fees unless otherwise exempted.
Phase II: Chapter 55A Expunction Architecture (2025–2026)
The expunction framework dictates the temporal and procedural requirements for legally destroying records. House Bill 4504 achieved a massive nonsubstantive recodification, entirely repealing Chapter 55 and creating Chapter 55A to modernize terminology and layout, effective January 1, 2025. Subsequent legislation in the 89th Session layered substantive procedural enhancements onto this new foundation.
Modernization of Procedures (SB 1667 and SB 537)
Prior to 2025, expunction proceedings were frequently delayed by manual certified mailings and highly variable, localized county fees. Senate Bill 1667, effective September 1, 2025, fundamentally modernized this logistical process. The bill mandates that electronic service of expunction petitions and orders to state agencies is entirely free of charge to the petitioner. It standardizes a minimal $25 fee per entity only in rare cases where non-electronic service is strictly required. Furthermore, SB 1667 permits court clerks to retain expunction orders indefinitely, solving a critical historical issue where petitioners lost their physical orders and could not verify their expunged status after the clerk destroyed the case file.
However, SB 1667 strictly exempts certain federal mental health records (specifically federal prohibited person information under Government Code 411.052) from destruction. This ensures that critical data preventing firearm purchases by legally disqualified individuals is retained and kept confidential by the court, even if the underlying criminal case is expunged.
Simultaneously, Senate Bill 537, also effective September 1, 2025, created powerful financial incentives for rehabilitative justice. It mandates the waiver of all expunction filing fees for individuals who successfully complete specialized diversionary programs. This includes Veterans Treatment Courts (Government Code 124), Mental Health Court Programs (Government Code 125), and authorized pretrial intervention programs under Government Code 76.011.
Algorithmic Expunction Pathways
Eligibility for expunction under Chapter 55A generally routes through four distinct algorithmic categories:
Disposition Type
Expunction Eligibility Trigger
Statutory Basis
Acquittal / Actual Innocence
Immediate. Trial court must advise defendant and may enter order within 30 days.
Art. 55A.002, 55A.003
Class C Deferred Adjudication
Immediate upon successful completion and discharge.
Art. 55A.051
Unfiled Arrests (No Charges)
Expiration of standard wait period (180 days Class C, 1 year Class A/B, 3 years Felony) OR Prosecutor Certification.
Art. 55A.052
Dismissed Charges (Filed)
Expiration of the Statute of Limitations for the underlying offense.
Art. 55A.053
Pathway 1: Acquittals and Actual Innocence If a defendant goes to trial and is found "Not Guilty" by a judge or jury, they are entitled to an immediate expunction. Chapter 55A provides a streamlined, automatic mechanism wherein the trial court is obligated to advise the defendant of this right and can enter the order within 30 days of the acquittal without requiring a separate civil lawsuit. Similarly, a pardon based on actual innocence grants an immediate entitlement to expunction.
Pathway 2: Class C Deferred Adjudication The sole exception to the universal rule that deferred adjudication precludes expunction applies exclusively to Class C misdemeanors (fine-only offenses, such as minor traffic violations or public intoxication). Successful completion of a Class C deferred adjudication results in a dismissal that is treated as immediately eligible for an expunction petition.
Pathway 3: Unfiled Arrests If an individual is arrested but the prosecutor declines to present an indictment or information, the individual must wait for the expiration of a statutory waiting period from the date of arrest. These default periods are 180 days for Class C misdemeanors, 1 year for Class A or B misdemeanors, and 3 years for all felonies. Alternatively, an expunction may be granted prior to these deadlines if the prosecuting attorney formally certifies that the records are no longer necessary for any ongoing criminal investigation.
Pathway 4: Dismissed Charges and the SOL Dependency If formal charges were filed but subsequently dismissed or quashed, the petitioner generally must wait until the Statute of Limitations (SOL) for the underlying offense has completely expired. The expiration of the SOL ensures the state is procedurally barred from re-filing the charges, representing finality in the case.
There are highly specific exceptions to the SOL wait time for dismissals. The law permits a petitioner to bypass the rigorous SOL waiting period if the dismissal was the direct result of completing an authorized pretrial intervention program, a veterans treatment court, or a mental health court, or if the indictment was deemed legally void due to false information, mistaken identity, or a lack of probable cause. Absent these specific diversionary programs, calculating the exact expiration of the statute of limitations is the core algorithmic requirement for determining dismissal eligibility.
Phase III: The Statute of Limitations Matrix (CCP Chapter 12)
The Texas Code of Criminal Procedure Chapter 12 defines the maximum time allowable between the commission of an offense and the presentment of an indictment or information. Satisfying the statute of limitations means the state has "presented" the charging instrument to the court, thereby stopping the clock.
The 89th Legislative Session aggressively expanded these temporal windows to address modern forensic realities and the rise of sophisticated, deeply concealed financial crimes. An automated eligibility system must cross-reference the offense type against these updated timelines to calculate the exact date a dismissal becomes eligible for expunction.
Offenses with No Statute of Limitations
Under Article 12.01(1), the state of Texas has determined that certain egregious offenses may be prosecuted at any point in perpetuity. Consequently, an arrest for these crimes, if dismissed without prejudice, can theoretically never be expunged via the SOL pathway, as the state's right to prosecute never officially expires.
Offense Category
Statutory Reference
Nature of the Exception
Murder & Manslaughter
Art. 12.01(1)(A)
Covers all criminal homicides under PC Chapter 19.
Severe Sexual Assaults
Art. 12.01(1)(B)
Aggravated sexual assaults under PC 22.011 / 22.021.
Serial Sexual Offenses
Art. 12.01(1)(C)(ii)
Probable cause exists of similar offenses against 5+ victims.
DNA Exception Cases
Art. 12.01(1)(C)(i)
Biological matter collected but untested or unmatched.
Child Sexual Abuse
Art. 12.01(1)(D/E)
Continuous abuse (PC 21.02) and Indecency with a Child.
Fatal Hit and Run
Art. 12.01(1)(F)
Leaving the scene of a collision resulting in death.
Human Trafficking
Art. 12.01(1)(G/H)
High-level and continuous trafficking of persons.
The Ten-Year Limitation Tier: The SB 16 Deed Theft Expansion
The 10-year limitation tier (Article 12.01(2)) generally applies to severe felonies involving a breach of fiduciary duty, forgery, arson, and select non-forensic sexual assaults.
A landmark development in the 89th Session was the passage of Senate Bill 16, effective September 17, 2025. Driven by an epidemiological surge in sophisticated property scams targeting the aging population, SB 16 created the new Penal Code offenses of "Real Property Theft" (PC 31.23) and "Real Property Fraud" (PC 32.60). Real property crimes are uniquely damaging because victims often do not realize their home's title has been fraudulently transferred until years later when attempting to sell, inhabit, or mortgage the property.
Recognizing that standard theft limitations were vastly inadequate for these clandestine crimes, the legislature explicitly elevated real property theft and fraud to the 10-year limitation tier. By doing so, the state ensures prosecutors possess a decade-long investigative window to unravel complex, multi-jurisdictional deed fraud networks. For an eligibility bot, any dismissal for PC 31.23 or 32.60 must enforce a strict 10-year wait from the date of the offense.
The Seven-Year Limitation Tier: The SB 2798 Fraud Overhaul
Prior to 2025, financial crimes operated under a fractured patchwork of limitations that hampered law enforcement. Senate Bill 2798, effective September 1, 2025, centralized and overhauled the prosecution of fraud. Acknowledging that financial perpetrators utilize sophisticated concealment methods that delay discovery, and that financial investigations demand time-intensive subpoena cycles for out-of-state banking records, the legislature imposed a uniform seven-year statute of limitations for virtually all fraud offenses.
Under the revised Article 12.01(3), the 7-year limitation now strictly applies to:
General Chapter 32 Fraud Offenses (including Credit Card/Debit Card Abuse, False Statement to Obtain Credit, and Identity Theft).
Money Laundering.
Medicaid and Health Care Fraud.
Bigamy (provided no minor is involved).
Felony Tax Code Violations.
Crucial Algorithmic Note on Non-Retroactivity: SB 2798 includes a strict non-retroactivity provision. If an older fraud offense became barred by its previous, shorter limitation period (e.g., the old 3-year or 5-year limits) before September 1, 2025, it remains forever barred, and the individual is eligible for expunction based on the old timeline. The new 7-year limit applies exclusively to cases that were still legally active and unexpired as of the effective date.
The Five-Year and Three-Year Default Tiers
The 5-year limit acts as the baseline for standard felony property crimes and violent offenses that do not trigger higher enhancements. This includes Standard Theft, Robbery, Kidnapping, Burglary, and Insurance Fraud.
Any felony not explicitly enumerated in the higher tiers defaults to a standard 3-year limitation under Article 12.01(11) (the catch-all tier). This encompasses standard drug possession offenses, non-aggravated assaults, and tampering with government records.
Notably, this catch-all tier encompasses the newly created Penal Code 21.03—"Continuous Sexual Abuse"—enacted in 2025. While continuous abuse against a child or disabled person (PC 21.02) carries no limitation, the legislature did not explicitly add the new adult-focused PC 21.03 to the "no limitation" list. Consequently, continuous sexual abuse against adults currently operates under this highly restrictive 3-year limitation window.
Misdemeanor Limitations
Article 12.02 dictates that for most Class A, B, and C misdemeanors (including first-time DWI, petty theft, and marijuana possession), the state must present charges within a strict 2-year window from the date of the offense.
The primary exception is for Misdemeanor Assault involving Family Violence. Acknowledging the cyclical nature of domestic abuse, the psychological control exerted by abusers, and the frequency of delayed reporting or initial victim reluctance, the legislature extended the limitation for family violence assaults to 3 years.
Discovery Rules and Victim-Age Extensions (Tolling the Clock)
For offenses involving professional concealment or violations of public trust, the limitation clock does not begin on the date the crime was committed, but rather on the date it is discovered. Senate Bill 127, effective September 1, 2025, drastically altered the framework for mandatory reporters. Under the updated Family Code 261.109(c), a professional's "Failure to Report Child Abuse or Neglect" is now subject to a discovery rule. A State Jail Felony failure to report allows 4 years from discovery, while a Class A Misdemeanor allows 3 years from discovery. This ensures that professionals (such as teachers and physicians) cannot escape liability simply because the underlying abuse remained successfully hidden until the standard limitation period expired.
To protect minors, Texas law heavily tolls the statute of limitations until the victim reaches the age of majority. For offenses such as Injury to a Child (10 years from the 18th birthday), Trafficking of a Child (20 years from the 18th birthday), and Sexual Performance by a Child (20 years from the 18th birthday), the state maintains prosecutorial jurisdiction well into the victim's adulthood. An arrest for these offenses will remain ineligible for SOL-based expunction for decades.
Phase IV: Chapter 411 Nondisclosure Architecture (2025–2026)
For records that cannot be legally destroyed via expunction—primarily because the defendant was placed on deferred adjudication or was convicted of a minor offense—an Order of Nondisclosure offers a mechanism to seal the record.
To accurately assess nondisclosure eligibility, the algorithm must identify the correct statutory pathway based on the case disposition and enforce the precise waiting period required by law. The waiting period clock universally begins on the date of official discharge, dismissal, or completion of the sentence.
Deferred Adjudication Community Supervision Pathways
If a defendant successfully completes deferred adjudication and the case is dismissed, they avert a final conviction and are generally eligible for sealing, provided the offense is not barred by the 411.074 lifetime exclusions.
Statutory Pathway
Offense Type
Required Waiting Period Post-Discharge
Gov't Code 411.072
Standard Non-Violent Misdemeanors.
Immediate. Court must grant automatically upon discharge.
Gov't Code 411.0725
Serious Misdemeanors (Penal Code Chapters 20–46).
2 Years. Includes non-family assault, weapons, indecency.
Gov't Code 411.0725
Eligible Felony Offenses.
5 Years.
Gov't Code 411.0726
DWI Deferred Adjudication (With Interlock).
2 Years. Requires 6 months of interlock usage.
Gov't Code 411.0726
DWI Deferred Adjudication (No Interlock).
5 Years.
Section 411.072 provides an automatic sealing mechanism for first-time, non-violent misdemeanor deferred adjudications that occurred after September 1, 2017. If eligible, the judge is statutorily required to issue the nondisclosure order at the time of discharge without requiring a formal petition or waiting period. All other deferred adjudications must route through the petition-based 411.0725 or 411.0726 pathways, enforcing the 2-year or 5-year waiting periods.
First-Time Misdemeanor Convictions (The Second Chance Laws)
Texas law strictly prohibits the sealing of felony convictions. However, the state permits the sealing of actual final convictions for first-time misdemeanor offenses. The system must enforce the "One-and-Done" rule: the petitioner must have never been previously convicted of or placed on deferred adjudication for any other offense (excluding fine-only traffic tickets) in their entire lifetime.
Statutory Pathway
Offense / Sentence Type
Required Waiting Period Post-Completion
Gov't Code 411.073
Misdemeanor Conviction with Probation.
Immediate. Or 2 years if a Chapter 20-46 serious misdemeanor.
Gov't Code 411.0735
Misdemeanor Conviction with Jail Time (No Probation).
2 Years following completion of sentence.
Gov't Code 411.0731
First-Time DWI Conviction with Probation.
2 Years (with interlock) or 5 Years (no interlock).
Gov't Code 411.0736
First-Time DWI Conviction with Jail Time.
3 Years following completion of sentence.
The DWI conviction sealing pathways (411.0731 and 411.0736) are governed by highly specific criteria. The individual's Blood Alcohol Concentration (BAC) must have been below 0.15, the incident must not have involved an accident with another person, and the individual must have absolutely no prior criminal record of any kind.
Algorithmic Output Generation: The Logic Tree
To synthesize the myriad of legislative updates, overlapping statutes, and procedural waiting periods into a functional output for a legal compliance bot, the system must process user data through five sequential gates.
Step 1: The Global Disqualification Audit The system scans the user's entire lifetime history against Gov't Code 411.074. If the history contains any conviction or deferred adjudication for a listed serious offense (Murder, Sex Crimes, Trafficking, Aggravated Kidnapping) or carries an affirmative finding of Family Violence, the system flags the user as Permanently Ineligible for any nondisclosure. Concurrently, it checks the Criminal Episode Rule: if an arrest resulted in a secondary conviction, that specific arrest is Permanently Ineligible for expunction.
Step 2: Disposition Classification
The system classifies the specific target charge:
Path A (Acquittal, Pardon, Class C Deferred): Route directly to Immediate Expunction Eligibility.
Path B (Dismissed without Probation): Route to Expunction SOL Evaluation.
Path C (Deferred Adjudication - Misd/Felony): Route to Nondisclosure Wait Time Evaluation.
Path D (Conviction - Misdemeanor): Execute the "One-and-Done" absolute clean history verification. If true, route to Nondisclosure Wait Time Evaluation.
Path E (Conviction - Felony): Flag as Permanently Ineligible for relief.
Step 3: Temporal Evaluation (The Wait Times)
For Path B (Dismissals), the system pulls the arrest date and adds the updated Chapter 12 limitations: +10 years for Deed Theft (SB 16), +7 years for Chapter 32 Fraud (SB 2798), +3 years for standard felonies, +3 years for family violence misdemeanors, or +2 years for standard misdemeanors. If the current date surpasses the calculated date, the status updates to Expunction Eligible.
For Paths C and D (Nondisclosures), the system pulls the discharge date and adds the 411 framework requirements (+0, +2, +3, or +5 years based on offense grade, probation vs. jail time, and interlock usage).
Step 4: The Clean Period Cross-Check
For any nondisclosure relying on a waiting period, the system verifies that no new convictions or deferred adjudications occurred between the probation start date and the calculated eligibility open date. If a violation is found, the status updates to Ineligible due to Intervening Offense.
Step 5: Output Construction
The bot must generate a standardized response detailing:
Current Status: (Eligible, Ineligible, or Waiting).
Legal Reason: Briefly citing the rule (e.g., "Barred by Criminal Episode Rule CCP 55A.151" or "Wait period met under Gov't Code 411.0725").
Key Dates: If they are waiting, providing the exact date eligibility opens based on the SOL or discharge calculations.
Next Steps: Advising whether a Petition for Nondisclosure or an Ex Parte Petition for Expunction is required.
By rigidly adhering to this codified logic, automated systems can navigate the intricate, highly consequential landscape of Texas record clearing, ensuring absolute statutory compliance while dynamically accounting for the sweeping legislative modernizations of the 2025 and 2026 sessions.
