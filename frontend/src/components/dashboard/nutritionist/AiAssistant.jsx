import React, { useState, useEffect, useRef } from 'react';

const AiAssistant = () => {
  // Chat messages state
  const [chatMessages, setChatMessages] = useState([
    { 
      sender: 'ai', 
      content: "Hello! I'm your AI nutrition assistant. How can I help you with your nutrition planning today?" 
    }
  ]);
  
  // Input state
  const [messageInput, setMessageInput] = useState('');
  
  // Ref for auto-scrolling chat
  const chatEndRef = useRef(null);
  
  // Scroll to bottom of chat when messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);
  
  // Handle message input change
  const handleMessageInputChange = (e) => {
    setMessageInput(e.target.value);
  };
  
  // Handle Enter key press
  const handleMessageKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // Send message
  const handleSendMessage = () => {
    if (messageInput.trim() === '') return;
    
    // Add user message
    setChatMessages(prevMessages => [
      ...prevMessages, 
      { sender: 'user', content: messageInput.trim() }
    ]);
    
    // Clear input
    setMessageInput('');
    
    // Generate AI response (simulated)
    setTimeout(() => {
      generateAiResponse(messageInput.trim());
    }, 1000);
  };
  
  // Generate AI response
  const generateAiResponse = (userInput) => {
    let response = "I'm processing your request...";
    const input = userInput.toLowerCase();
    
    // More comprehensive keyword-based responses for nutritionists
    if (input.includes('meal plan')) {
      response = "Creating effective meal plans involves understanding the client's goals, preferences, and any dietary restrictions. Here are key considerations:\n\n1. Conduct a thorough nutritional assessment first\n2. Calculate their specific caloric needs based on BMR and activity level\n3. Determine appropriate macronutrient distribution\n4. Consider food preferences, allergies, and budget\n5. Plan for meal timing and frequency\n6. Include specific food portions and measurements\n7. Provide shopping lists and prep instructions\n8. Schedule regular follow-ups to assess adherence and make adjustments\n\nWould you like me to help you create a personalized meal plan template?";
    } else if (input.includes('protein')) {
      response = "As a nutritionist, you can recommend these protein sources based on client needs:\n\n• Animal proteins (complete):\n  - Lean meats: chicken, turkey, lean beef (7g protein per oz)\n  - Fish: salmon, tuna, tilapia (6-7g protein per oz)\n  - Eggs: (6g protein per egg)\n  - Dairy: Greek yogurt (15-20g per cup), cottage cheese (25g per cup)\n\n• Plant proteins (combine for completeness):\n  - Legumes: lentils (18g per cup), chickpeas (15g per cup)\n  - Tofu and tempeh (15-20g per cup)\n  - Quinoa (8g per cup)\n  - Nuts and seeds (5-7g per 1/4 cup)\n  - Plant-based protein powders\n\nFor vegetarian clients, emphasize combining complementary proteins and possibly B12 supplementation.";
    } else if (input.includes('calorie')) {
      response = "For accurate calorie recommendations, nutritionists should consider:\n\n1. Calculate Basal Metabolic Rate (BMR) using either:\n   - Mifflin-St Jeor equation (most accurate)\n   - Harris-Benedict equation\n   - Katch-McArdle (if body fat % is known)\n\n2. Apply activity multiplier:\n   - Sedentary (1.2) - office job, little exercise\n   - Light activity (1.375) - light exercise 1-3 days/week\n   - Moderate (1.55) - moderate exercise 3-5 days/week\n   - Active (1.725) - hard exercise 6-7 days/week\n   - Very active (1.9) - physical job & hard exercise\n\n3. Adjust based on goals:\n   - Maintenance: TDEE\n   - Weight loss: 15-25% deficit (typically 500 calories)\n   - Weight gain: 10-20% surplus\n\nConsider metabolic conditions and regularly reassess as weight changes.";
    } else if (input.includes('sugar')) {
      response = "To help clients reduce sugar intake, nutritionists should recommend these evidence-based strategies:\n\n1. Education:\n   - Teach label reading (sugar has many names)\n   - Explain glycemic index and load concepts\n   - Highlight hidden sugar sources\n\n2. Gradual reduction approach:\n   - Start by cutting obvious sources by 25%\n   - Progressively reduce over 4-8 weeks\n   - Focus on one category at a time (beverages first)\n\n3. Practical recommendations:\n   - Substitute with whole fruits (fiber slows absorption)\n   - Use spices like cinnamon, nutmeg, vanilla\n   - Increase protein and healthy fats at meals\n   - Ensure adequate sleep (reduces cravings)\n   - Address emotional eating triggers\n   - Maintain steady blood sugar with regular meals\n\n4. Recommended replacements:\n   - Stevia or monk fruit (in moderation)\n   - Erythritol for baking\n   - Whole food sweeteners like dates and bananas";
    } else if (input.includes('macro')) {
      response = "When determining macronutrient distribution for clients, consider these evidence-based guidelines:\n\n• General health maintenance:\n  - Protein: 15-25% (0.8-1g/kg bodyweight)\n  - Carbs: 45-65% (emphasis on complex carbs)\n  - Fats: 20-35% (focus on unsaturated)\n\n• Weight loss:\n  - Protein: 25-30% (1.6-2.2g/kg bodyweight)\n  - Carbs: 30-45% (timing around workouts)\n  - Fats: 25-35% (essential fats prioritized)\n\n• Athletic performance:\n  - Protein: 20-30% (1.2-2.0g/kg depending on sport)\n  - Carbs: 50-65% (endurance athletes higher)\n  - Fats: 20-30% (timing matters)\n\n• Special conditions:\n  - Ketogenic: 70-80% fat, 15-25% protein, 5-10% carbs\n  - PCOS: Higher protein (25-30%), moderate carbs (30-40%)\n  - Diabetes: Carb consistency and quality most important\n\nRemember that individual variation is significant - monitor and adjust based on results.";
    } else if (input.includes('ibs') || input.includes('fodmap')) {
      response = "For clients with IBS, nutritionists should consider this evidence-based approach:\n\n1. Diagnostic confirmation:\n   - Ensure medical diagnosis before nutritional intervention\n   - Identify subtype (IBS-C, IBS-D, or IBS-M)\n\n2. Initial assessment:\n   - Food and symptom journal for 2 weeks\n   - Identify trigger foods and timing patterns\n   - Evaluate current fiber and fluid intake\n\n3. First-line interventions:\n   - Regular meal timing\n   - Adequate hydration (2-3L daily)\n   - Soluble fiber adjustment\n   - Stress management techniques\n\n4. Low FODMAP approach (if needed):\n   - Elimination phase (2-6 weeks)\n   - Systematic reintroduction\n   - Personalization phase\n\n5. Other nutritional considerations:\n   - Limit alcohol, caffeine, spicy foods\n   - Peppermint and ginger supplementation\n   - Probiotic strains (Bifidobacterium and Lactobacillus)\n   - Digestive enzymes in specific cases\n\nThe goal is to expand diet diversity while managing symptoms.";
    } else if (input.includes('sports') || input.includes('athlete')) {
      response = "Nutritional recommendations for athletic clients should be periodized according to training phases:\n\n1. Base/General Preparation:\n   - Caloric surplus of 300-500 calories\n   - Protein: 1.6-1.8g/kg body weight\n   - Higher carbohydrates: 5-7g/kg\n   - Nutrient timing less critical\n\n2. Competition/Performance:\n   - Maintenance or slight surplus\n   - Protein: 1.8-2.0g/kg body weight\n   - Strategic carbohydrate timing\n   - Pre-workout: 1-4g/kg carbs 1-4 hours before\n   - During (if >60 min): 30-60g carbs/hour\n   - Post-workout: 0.8g/kg carbs with 0.2-0.4g/kg protein\n\n3. Recovery/Transition:\n   - Possible slight deficit if needed\n   - Anti-inflammatory focus (omega-3s, antioxidants)\n   - Adequate micronutrients (iron, vitamin D, magnesium)\n\n4. Key supplements with evidence:\n   - Creatine monohydrate: 3-5g daily\n   - Caffeine: 3-6mg/kg 60 min pre-exercise\n   - Beta-alanine: 3-6g daily (for high-intensity)\n   - Protein timing around workouts\n\nHydration needs also vary by sport, climate and individual sweat rate.";
    } else if (input.includes('pregnant') || input.includes('pregnancy')) {
      response = "Prenatal nutrition guidelines for client counseling:\n\n1. Caloric adjustments:\n   - First trimester: No additional calories\n   - Second trimester: +340 calories/day\n   - Third trimester: +450 calories/day\n\n2. Critical nutrients to focus on:\n   - Folate: 600mcg daily (start before conception)\n   - Iron: 27mg daily (monitor for deficiency)\n   - Calcium: 1000mg daily\n   - Choline: 450mg daily (often overlooked)\n   - Omega-3 DHA: 200-300mg daily\n   - Iodine: 220mcg daily\n\n3. Foods to limit:\n   - High-mercury fish\n   - Unpasteurized dairy products\n   - Undercooked meats/eggs\n   - Excessive caffeine (>200mg daily)\n   - Alcohol (complete avoidance)\n\n4. Managing common issues:\n   - Morning sickness: Small, frequent meals, ginger\n   - Constipation: Adequate hydration, fiber\n   - Heartburn: Small meals, avoid triggers\n   - Gestational diabetes: Carb distribution, timing\n\nSupplementation should be personalized based on dietary patterns and lab values.";
    } else if (input.includes('diabetes') || input.includes('blood sugar')) {
      response = "For clients with diabetes or insulin resistance, nutritionists should focus on these evidence-based approaches:\n\n1. Carbohydrate management:\n   - Consistent carb intake at meals\n   - Focus on quality: low glycemic index, high fiber\n   - Carb pairing with protein and healthy fats\n   - Individual carb tolerance assessment\n\n2. Meal pattern recommendations:\n   - Regular meal timing (3-4 hour intervals)\n   - Avoiding long fasting periods\n   - Protein-containing breakfast\n   - Balanced macronutrient distribution\n\n3. Blood glucose management strategies:\n   - Post-meal walking (even 10 minutes helps)\n   - Apple cider vinegar before meals (1-2 tbsp)\n   - Protein or fat before carbohydrates\n   - Adequate hydration\n\n4. Supplements with clinical evidence:\n   - Chromium: 200-1000mcg daily\n   - Alpha-lipoic acid: 600-1200mg daily\n   - Berberine: 1000-1500mg daily\n   - Cinnamon: 1-6g daily\n\nContinuous glucose monitoring can provide personalized insights for meal planning.";
    } else if (input.includes('gut health') || input.includes('microbiome')) {
      response = "To improve client gut health and microbiome diversity, nutritionists should recommend:\n\n1. Dietary diversity strategies:\n   - 30+ different plant foods weekly\n   - Variety of fiber types (soluble, insoluble, resistant starch)\n   - Rotate protein sources\n   - Include forgotten foods (herbs, spices, varied greens)\n\n2. Specific microbiome-supporting foods:\n   - Prebiotic-rich: Jerusalem artichokes, garlic, onions, leeks\n   - Polyphenol-rich: berries, dark chocolate, green tea, herbs\n   - Fermented foods: yogurt, kefir, sauerkraut, kimchi\n   - Omega-3 sources: fatty fish, flax, chia\n\n3. Eating patterns that benefit gut health:\n   - Adequate meal spacing (3-4 hours)\n   - Chewing thoroughly\n   - Hydration between (not during) meals\n   - Time-restricted eating (12+ hour overnight fast)\n\n4. Client-specific considerations:\n   - Gradual fiber increases to minimize discomfort\n   - FODMAP sensitivity assessment if symptoms persist\n   - Potential probiotic strains based on concerns\n   - Food sensitivity investigation\n\nStress management and sleep quality are also crucial for gut health.";
    } else if (input.includes('weight loss') || input.includes('fat loss')) {
      response = "For sustainable weight management counseling, nutritionists should implement these evidence-based strategies:\n\n1. Beyond calories in/calories out:\n   - Focus on food quality and nutrient density\n   - Protein leverage: 1.6-2.2g/kg to reduce hunger\n   - Strategic carbohydrate timing around activity\n   - Adequate fiber: 25-35g daily minimum\n\n2. Metabolic optimization:\n   - Blood sugar stability (regular meals, proper pairing)\n   - Sleep quality (7-9 hours, consistent schedule)\n   - Stress management (cortisol reduction)\n   - Non-exercise movement throughout day\n\n3. Behavioral approaches:\n   - Habit stacking over willpower\n   - Environmental restructuring\n   - Meal preparation systems\n   - Hunger/fullness monitoring\n   - Identity-based goals over outcome goals\n\n4. Plateau strategies:\n   - Diet breaks every 8-12 weeks\n   - Calorie cycling\n   - Strength training emphasis\n   - Protein redistribution\n   - Addressing psychological barriers\n\nLong-term success correlates more with consistency than perfection.";
    } else if (input.includes('inflammation') || input.includes('anti-inflammatory')) {
      response = "For clients with chronic inflammation, nutritionists should provide these evidence-based recommendations:\n\n1. Foods to emphasize:\n   - Omega-3 rich foods: fatty fish, walnuts, flax, chia\n   - Colorful polyphenols: berries, dark leafy greens, purple/red produce\n   - Spices: turmeric, ginger, cinnamon, cloves (consistently)\n   - Prebiotic fibers: diverse plants, resistance starch\n   - Fermented foods: kimchi, sauerkraut, yogurt\n\n2. Foods to moderate or avoid:\n   - Industrial seed oils high in omega-6 (soybean, corn)\n   - Refined carbohydrates and added sugars\n   - Processed meats with nitrates/nitrites\n   - Food sensitivities (individualized)\n   - Alcohol (limit to <5 drinks weekly)\n\n3. Eating patterns:\n   - Mediterranean diet (strongest evidence)\n   - Time-restricted eating (12-16 hour fasting window)\n   - Regular meal timing\n\n4. Lifestyle integration:\n   - Quality sleep (crucial for resolution)\n   - Stress management (direct inflammatory pathway)\n   - Regular movement (anti-inflammatory signaling)\n   - Environmental toxin reduction\n\nMonitor inflammatory markers like CRP and symptom journals to assess progress.";
    } else if (input.includes('pcos')) {
      response = "Nutritional strategies for clients with PCOS should focus on managing insulin resistance and inflammation:\n\n1. Macronutrient considerations:\n   - Moderate carbohydrate intake (30-40% of calories)\n   - Emphasize low glycemic load carbohydrates\n   - Higher protein intake (25-30% of calories)\n   - Adequate healthy fats (30-35% of calories)\n\n2. Specific dietary patterns with evidence:\n   - Mediterranean diet (strongest research support)\n   - Low glycemic index approach\n   - Anti-inflammatory focus\n   - Time-restricted eating (preliminary evidence)\n\n3. Micronutrient considerations:\n   - Inositol supplementation (2-4g daily, myo- and d-chiro forms)\n   - Vitamin D optimization (typically 2000-4000 IU daily)\n   - Magnesium (300-400mg daily)\n   - Zinc adequacy (25-30mg daily)\n   - Omega-3 fatty acids (1-2g EPA/DHA daily)\n\n4. Lifestyle integration:\n   - Regular resistance training\n   - Stress management (cortisol impacts insulin sensitivity)\n   - Sleep optimization (7-9 hours quality sleep)\n   - Environmental endocrine disruptor reduction\n\nMonitor both subjective improvements (cycle regularity, skin changes) and objective markers (fasting insulin, testosterone, inflammatory markers) for best outcomes.";
    } else if (input.includes('mental health')) {
      response = "Nutritional strategies to support mental health conditions, based on current evidence:\n\n1. Depression & Anxiety:\n   - Mediterranean dietary pattern (strongest evidence)\n   - Omega-3 fatty acids (1-2g EPA daily)\n   - Adequate B vitamins, especially folate, B6, and B12\n   - Vitamin D optimization (2000-5000 IU based on blood levels)\n   - Magnesium-rich foods (dark chocolate, nuts, seeds, leafy greens)\n   - Zinc adequacy (oysters, meat, pumpkin seeds)\n   - Probiotic-rich foods (fermented foods, yogurt with live cultures)\n\n2. Specific food considerations:\n   - Minimize refined carbohydrates and added sugars\n   - Reduce alcohol consumption\n   - Limit caffeine with anxiety disorders\n   - Emphasize antioxidant-rich foods (berries, colorful vegetables)\n   - Include tryptophan and tyrosine sources for neurotransmitter production\n\n3. Meal pattern recommendations:\n   - Regular eating schedule to stabilize blood glucose\n   - Protein with each meal for neurotransmitter precursors\n   - Balanced meals avoiding prolonged fasting\n   - Hydration optimization\n\n4. Clinical considerations:\n   - Medication-nutrient interactions assessment\n   - Food sensitivities investigation (emerging evidence)\n   - Caffeine metabolism assessment (CYP1A2 polymorphisms)\n   - Microbiome diversity strategies (30+ plant foods weekly)\n\nThe gut-brain axis is a critical focus area, with early evidence suggesting inflammatory pathways as a mechanistic link between diet and mental health outcomes.";
    } else if (input.includes('balanced diet')) {
      response = "A balanced diet provides all essential nutrients in appropriate amounts to support optimal health. When counseling clients about balanced eating, focus on these key components:\n\n1. Macronutrient balance:\n   - Carbohydrates: 45-65% of calories from quality sources (whole grains, fruits, vegetables)\n   - Proteins: 15-25% of calories from diverse sources (plant and animal-based)\n   - Fats: 20-35% of calories with emphasis on unsaturated fats\n\n2. Dietary approaches with strong evidence:\n   - Mediterranean diet pattern\n   - DASH diet\n   - Flexitarian approaches\n\n3. Food group recommendations:\n   - 5+ servings of vegetables and fruits daily\n   - Adequate fiber (25-30g daily)\n   - Lean protein sources distributed throughout the day\n   - Moderate whole grains according to activity level\n   - Heart-healthy fats (olive oil, avocado, nuts, seeds)\n   - Limited ultra-processed foods\n\n4. Micronutrient considerations:\n   - Focus on nutrient density rather than just calories\n   - Color diversity for phytonutrient variety\n   - Strategic supplementation only when necessary\n\nImportance for health outcomes:\n- Reduced chronic disease risk (cardiovascular disease, diabetes, certain cancers)\n- Improved energy and cognitive function\n- Better immune function and inflammatory response\n- Hormonal regulation and metabolic health\n- Supports healthy aging and longevity\n\nEmphasize that balanced eating patterns allow flexibility and cultural adaptations rather than rigid rules.";
    } else if (input.includes('calories')) {
      response = "Calorie requirements vary significantly between individuals. When determining appropriate intake for clients, consider these evidence-based approaches:\n\n1. Basal Metabolic Rate (BMR) calculations:\n   - Mifflin-St Jeor equation (most accurate):  \n     Men: BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age) + 5  \n     Women: BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age) - 161\n   - Harris-Benedict equation (alternative):\n     Men: BMR = 88.362 + (13.397 × weight in kg) + (4.799 × height in cm) - (5.677 × age)  \n     Women: BMR = 447.593 + (9.247 × weight in kg) + (3.098 × height in cm) - (4.330 × age)\n\n2. Total Daily Energy Expenditure (TDEE) factors:\n   - Sedentary (desk job, little exercise): BMR × 1.2\n   - Lightly active (light exercise 1-3 days/week): BMR × 1.375\n   - Moderately active (moderate exercise 3-5 days/week): BMR × 1.55\n   - Very active (intense exercise 6-7 days/week): BMR × 1.725\n   - Extremely active (physical job + intense exercise): BMR × 1.9\n\n3. Individual adjustment factors:\n   - Age (metabolic rate decreases ~2-3% per decade after 30)\n   - Muscle mass (higher muscle = higher BMR)\n   - Thyroid function and hormonal status\n   - Genetics and epigenetics\n   - Recent dietary history and metabolic adaptation\n\n4. Goal-specific adjustments:\n   - Weight maintenance: TDEE\n   - Weight loss: Deficit of 250-500 calories (0.5-1 lb/week)\n   - Weight gain: Surplus of 250-500 calories\n   - Athletic performance: Periodized approach based on training\n\nThe most effective approach combines calculation with monitoring and adjusting based on measured outcomes (weight, body composition, energy levels, performance metrics).\n\nAn emerging perspective focuses on calorie quality rather than just quantity - 200 calories from vegetables has a different metabolic effect than 200 calories from refined carbohydrates.";
    } else if (input.includes('protein sources')) {
      response = "When advising clients on protein sources, consider these options categorized by quality, bioavailability, and special dietary considerations:\n\n1. High-quality animal proteins (complete amino acid profile):\n   - Lean meats: chicken breast (31g/100g), turkey (29g/100g), lean beef (26g/100g)\n   - Fish/seafood: tuna (30g/100g), salmon (25g/100g), shrimp (24g/100g)\n   - Eggs: whole (12.5g/100g), egg whites (11g/100g)\n   - Dairy: Greek yogurt (10g/100g), cottage cheese (11g/100g), whey protein (80-90g/100g)\n\n2. Plant proteins (combine for completeness):\n   - Legumes: lentils (9g/100g), chickpeas (8.9g/100g), black beans (8.9g/100g)\n   - Soy products: tempeh (19g/100g), tofu (8g/100g), edamame (11g/100g)\n   - Nuts/seeds: hemp seeds (31g/100g), pumpkin seeds (19g/100g), almonds (21g/100g)\n   - Whole grains: quinoa (4.4g/100g), buckwheat (3.4g/100g), amaranth (4g/100g)\n   - Plant protein powders: pea (80g/100g), rice (80g/100g), hemp (50g/100g)\n\n3. Protein quality considerations:\n   - Digestible Indispensable Amino Acid Score (DIAAS): Eggs (1.13), Milk protein (1.18), Beef (1.10)\n   - Protein Digestibility Corrected Amino Acid Score (PDCAAS): Animal proteins typically 0.9-1.0, plant proteins 0.5-0.8\n\n4. Special population considerations:\n   - Athletes: Focus on leucine content (2.5g+ per meal)\n   - Older adults: Higher protein needs (1.2-1.6g/kg/day)\n   - Pregnancy: Increased requirements (1.1g/kg/day)\n   - Renal patients: Often require protein modification\n\n5. Practical recommendations:\n   - Distribute protein intake throughout the day (20-30g per meal)\n   - Combine complementary plant proteins for vegetarians/vegans\n   - Consider digestibility (some clients may tolerate certain sources better)\n   - Balance cost considerations with quality\n\nFor clients transitioning to more plant-based eating, focus on gradual changes and proper combining to ensure all essential amino acids are consumed.";
    } else if (input.includes('sugar')) {
      response = "When discussing sugar with clients, it's important to differentiate between types and their health effects based on current evidence:\n\n1. Types of sugars and their impact:\n   - Natural sugars (in fruits, vegetables, dairy): Contain fiber, vitamins, minerals that slow absorption\n   - Added sugars (table sugar, high fructose corn syrup): Rapid absorption, minimal nutritional value\n   - Sugar alcohols (xylitol, erythritol): Lower glycemic impact but may cause GI distress in some\n\n2. Health effects of excessive added sugar:\n   - Metabolic: Promotes insulin resistance, fatty liver, dyslipidemia\n   - Weight management: High caloric density, low satiety, promotes overeating\n   - Dental: Primary contributor to tooth decay\n   - Cognitive: Emerging evidence for impacts on focus, mood, and long-term brain health\n   - Inflammation: Associated with increased inflammatory markers\n\n3. Recommended limits (based on health organizations):\n   - WHO: Less than 10% of calories from added sugars, ideally under 5%\n   - AHA: Women: <25g (6 tsp)/day; Men: <36g (9 tsp)/day\n   - For reference: One 12oz soda contains ~39g sugar\n\n4. Clinical guidelines for sugar reduction:\n   - Focus on gradual reduction to accommodate taste adaptation\n   - Target liquid sugars first (sodas, juice, sweetened coffee)\n   - Address hidden sources (condiments, sauces, processed foods)\n   - Consider psychological factors (sugar's dopaminergic effects)\n   - Be aware of compensatory behaviors when reducing sugar\n\n5. Sugar alternatives:\n   - Non-nutritive sweeteners: Stevia, monk fruit (natural); aspartame, sucralose (artificial)\n   - Nutritive sweeteners: Date sugar, maple syrup, honey (use sparingly)\n\nRather than labeling sugar as entirely \"bad,\" focus on context, quantity, and source. Occasional consumption of added sugars within an otherwise nutrient-dense diet is compatible with good health for most individuals.";
    } else if (input.includes('eating before bedtime')) {
      response = "The question of eating before bedtime requires a nuanced approach based on both circadian biology and individual factors. Here's a comprehensive view to guide client recommendations:\n\n1. Physiological considerations:\n   - Insulin sensitivity decreases in the evening\n   - Melatonin production may be disrupted by late eating\n   - Digestive enzyme production decreases at night\n   - Lying down after eating may exacerbate reflux in susceptible individuals\n\n2. Evidence-based findings:\n   - Total caloric intake and dietary quality matter more than timing for weight management\n   - Large meals (>25-30% daily calories) within 2-3 hours of sleep may disrupt:\n     * Sleep quality and architecture\n     * Blood glucose regulation\n     * Digestive comfort\n   - Small, nutrient-dense snacks before bed may be beneficial for:\n     * Overnight muscle protein synthesis (especially in athletes)\n     * Blood glucose maintenance in diabetes\n     * Managing night hunger that disrupts sleep\n\n3. Ideal pre-bedtime nutrition (if needed):\n   - Modest protein source (15-25g)\n   - Limited simple carbohydrates\n   - Moderate healthy fats\n   - Examples: Greek yogurt with nuts, cottage cheese with berries, small protein shake\n\n4. Individual factors to consider:\n   - Sleep duration and quality\n   - Exercise timing (post-evening workout nutrition needs)\n   - Medical conditions (diabetes, GERD, etc.)\n   - Psychological relationship with food\n   - Chronotype (early birds vs. night owls)\n\n5. Time-restricted eating considerations:\n   - Growing evidence supports 12+ hour overnight fasting periods\n   - Benefits appear strongest when eating window aligns with daylight\n\nRecommendation: Focus on a personalized approach rather than strict rules. The ideal eating window should align with the client's unique circadian rhythm, lifestyle, health conditions, and goals.";
    } else if (input.includes('trans fats')) {
      response = "Trans fats are a type of unsaturated fat with specific structural properties that make them particularly harmful to health. Here's what nutritionists should know:\n\n1. Chemical structure and types:\n   - Artificial trans fats: Created through partial hydrogenation of vegetable oils\n   - Natural trans fats: Small amounts occur naturally in dairy and meat (primarily vaccenic acid and conjugated linoleic acid)\n\n2. Health effects (strong evidence):\n   - Cardiovascular: Increases LDL cholesterol while decreasing HDL cholesterol\n   - Inflammation: Promotes systemic inflammatory markers\n   - Insulin sensitivity: Impairs insulin function, increases diabetes risk\n   - Endothelial function: Damages blood vessel lining\n   - Mortality: Associated with increased all-cause mortality\n\n3. Regulatory status:\n   - FDA banned partially hydrogenated oils in 2018\n   - WHO recommends limiting to <1% of total calories\n   - Many countries have banned industrial trans fats\n\n4. Common sources to guide clients on avoiding:\n   - Processed foods made before regulatory changes\n   - Some baked goods and pastries\n   - Certain margarines and shortenings\n   - Deep-fried foods (especially commercial)\n   - Some microwave popcorn\n   - Imported packaged foods from countries without regulations\n\n5. Label reading guidance:\n   - \"Partially hydrogenated oils\" indicates trans fats\n   - Products can claim \"0g trans fat\" if <0.5g per serving\n   - Watch for serving size manipulation to hide trans fat content\n\n6. Naturally occurring trans fats:\n   - Current evidence suggests they don't share the same health risks\n   - CLA may have modest beneficial effects\n\nHealthier alternatives to recommend include olive oil, avocado oil, and other unprocessed plant oils, as well as natural fats from whole foods like avocados, nuts, and seeds.";
    } else if (input.includes('improve digestion')) {
      response = "To help clients improve digestion naturally, consider these evidence-based approaches targeting different aspects of digestive health:\n\n1. Dietary modifications:\n   - Fiber optimization: Gradually increase to 25-35g daily with adequate hydration\n   - Identify trigger foods: Use symptom journals to detect individual sensitivities\n   - Meal spacing: 3-4 hours between meals to allow full digestion\n   - Chewing thoroughly: Enhances digestive enzyme contact and reduces bacterial gas\n   - Mindful eating: Parasympathetic nervous system activation improves digestion\n\n2. Specific foods with digestive benefits:\n   - Fermented foods: Kimchi, sauerkraut, yogurt, kefir (probiotic sources)\n   - Prebiotic-rich foods: Jerusalem artichokes, garlic, onions, asparagus, green bananas\n   - Digestive-supporting herbs: Ginger, peppermint, fennel, chamomile as teas\n   - Bitter foods: Arugula, endive, radicchio (stimulate digestive secretions)\n   - Anti-inflammatory spices: Turmeric, cinnamon, cloves\n\n3. Hydration strategies:\n   - 2-3 liters water daily (more if high-fiber diet)\n   - Timing: Before meals rather than during (prevents digestive enzyme dilution)\n   - Warm liquids may be better tolerated than cold\n\n4. Lifestyle modifications:\n   - Regular physical activity (helps stimulate peristalsis)\n   - Stress management (stress directly impacts gut function via gut-brain axis)\n   - Proper toilet posture (using footstool to simulate squatting position)\n   - Abdominal massage (clockwise direction following colon)\n\n5. Supplement considerations (when appropriate):\n   - Digestive enzymes: For specific deficiencies\n   - Probiotics: Strain-specific for different conditions\n   - Prebiotics: FOS, GOS, XOS depending on tolerance\n   - Bitters: Traditional digestive support\n   - L-Glutamine: For intestinal barrier support\n\n6. Medical considerations:\n   - Rule out underlying conditions requiring medical intervention\n   - Medication review for those causing digestive side effects\n   - Functional testing when appropriate (microbiome analysis, food sensitivity testing)\n\nRemember that digestive health is highly individualized. What works for one client may not work for another, requiring personalized approaches.";
    } else if (input.includes('weight loss')) {
      response = "When counseling clients on weight management, focus on evidence-based, sustainable approaches rather than quick fixes:\n\n1. Foundational principles:\n   - Energy balance: Moderate caloric deficit (250-500 calories/day for 0.5-1 lb/week loss)\n   - Protein adequacy: 1.6-2.2g/kg ideal body weight (preserves muscle mass)\n   - Dietary quality: Nutrient density over calorie restriction alone\n   - Individualization: Tailored to preferences, lifestyle, medical history\n   - Sustainability: Can the approach be maintained long-term?\n\n2. Dietary approaches with strongest evidence:\n   - Mediterranean diet: Emphasizes vegetables, fruits, lean proteins, olive oil, moderate wine\n   - DASH diet: Focus on blood pressure control but effective for weight\n   - Higher protein approaches: Better satiety and muscle preservation\n   - Low glycemic approaches: Blood sugar stabilization improves hunger management\n\n3. Behavioral strategies (critical for long-term success):\n   - Self-monitoring: Food journals, regular weighing\n   - Environmental restructuring: Kitchen organization, meal preparation\n   - Stimulus control: Identifying and managing triggers for overconsumption\n   - Hunger/fullness awareness training\n   - Habit formation over willpower-dependent approaches\n\n4. Physical activity recommendations:\n   - 150-300 minutes moderate activity weekly (primarily for weight maintenance)\n   - Resistance training 2-3x weekly (preserves muscle mass)\n   - NEAT (non-exercise activity thermogenesis) emphasis\n   - Finding sustainable activities client enjoys\n\n5. Advanced strategies for plateaus:\n   - Calorie cycling/refeeds: Periodic higher calorie days\n   - Protein redistribution: Higher morning protein intake\n   - Sleep optimization: Critical for hunger hormone regulation\n   - Stress management: Cortisol impacts abdominal fat storage\n   - Meal timing: Evidence for time-restricted eating benefits\n\n6. Medical considerations:\n   - Rule out medical barriers (thyroid, PCOS, medication effects)\n   - Consider appropriate supplementation (vitamin D, magnesium)\n   - When to refer for medical intervention\n\nWeight loss interventions should focus on health parameters beyond the scale (metabolic health, energy, mood, performance) and consider weight history, genetic factors, and psychological aspects of eating behavior.";
    } else if (input.includes('carbs bad')) {
      response = "Carbohydrates are often misunderstood and inappropriately vilified. Here's a nuanced perspective to share with clients:\n\n1. Carbohydrate quality spectrum:\n   - Unprocessed, fiber-rich carbs: Whole fruits, vegetables, legumes, intact grains\n   - Minimally processed carbs: Steel-cut oats, brown rice, quinoa\n   - Refined carbs: White flour products, white rice\n   - Ultra-processed carbs: Sugary beverages, candy, highly processed snack foods\n\n2. Physiological roles of carbohydrates:\n   - Primary fuel for brain function and high-intensity exercise\n   - Spares protein for tissue building/repair rather than energy\n   - Provides fiber for gut health and microbiome diversity\n   - Delivers numerous phytonutrients in plant foods\n   - Supports thyroid function and hormone conversion\n\n3. Evidence-based perspectives:\n   - Population studies: Longest-lived populations consume 50-65% of calories from carbs\n   - Athletic performance: Carb intake correlates with performance in most sports\n   - Metabolic health: Quality and context matter more than absolute amount\n   - Weight management: Similar outcomes between moderate-carb and low-carb approaches when protein and calories are controlled\n\n4. Individual variation factors:\n   - Insulin sensitivity/metabolic health\n   - Activity type and level\n   - Genetic factors (amylase gene variation)\n   - Gut microbiome composition\n   - Personal preferences and cultural considerations\n\n5. Clinical considerations for carbohydrate modification:\n   - Type 2 diabetes/insulin resistance: Consider lower glycemic load, but not necessarily very low carb\n   - Specific neurological conditions: May benefit from ketogenic approaches\n   - Athletic populations: Periodized carbohydrate approach based on training\n   - IBS/digestive issues: May need specific carbohydrate adjustments (FODMAPs, etc.)\n\n6. Practical recommendations:\n   - Focus on unprocessed sources first\n   - Pair carbohydrates with protein and healthy fats\n   - Consider timing around activity\n   - Individualize based on health status and goals\n\nInstead of asking if carbs are \"bad,\" a better question is: \"Which carbohydrate sources, in what amounts, and at what times best support this individual's health and goals?\"";
    } else if (input.includes('water')) {
      response = "Hydration recommendations should be evidence-based and personalized rather than relying on generic advice. Here's a comprehensive approach to guide clients:\n\n1. General hydration guidelines:\n   - Institute of Medicine reference values:\n     * Women: ~2.7 liters (91oz) total water daily from all sources\n     * Men: ~3.7 liters (125oz) total water daily from all sources\n   - Note: This includes ~20% from food sources\n\n2. Individual adjustment factors:\n   - Body size: Roughly 30-40ml per kg of body weight\n   - Activity level: Add 0.5-1L per hour of exercise depending on intensity and sweat rate\n   - Environmental conditions: Higher temperature/humidity increases needs\n   - Altitude: Needs increase at elevations >8,200 feet\n   - Pregnancy/lactation: Additional 0.3-0.7L daily\n   - Health conditions: Kidney stones, UTIs may benefit from increased intake\n   - Medications: Some increase fluid needs (diuretics, lithium)\n\n3. Practical assessment methods:\n   - Urine color: Pale yellow indicates adequate hydration\n   - Sweat rate calculation: (Pre-exercise weight - Post-exercise weight) + Fluid consumed\n   - Thirst: Not ideal for older adults or during intense exercise\n   - Body weight fluctuations: >1% loss suggests dehydration\n\n4. Hydration strategies:\n   - Front-loading: Higher intake in morning, tapering in evening\n   - Regular sipping rather than large volumes infrequently\n   - Flavoring with fruit/herbs for increased compliance\n   - Setting reminders or visual cues\n   - Tracking methods appropriate to client motivation\n\n5. Sources beyond plain water:\n   - Herbal teas (count 100% toward hydration)\n   - Water-rich foods (cucumbers, watermelon, oranges, etc.)\n   - Milk and plant-based alternatives\n   - Limited caffeinated beverages (mild diuretic effect often overestimated)\n\n6. Special considerations:\n   - Exercise hydration: 5-7ml/kg 4 hours before, 3-5ml/kg 2 hours before\n   - Electrolyte balance with heavy sweating or endurance activities\n   - Older adults: Blunted thirst mechanism requires scheduled drinking\n\nFocus on individualization rather than arbitrary goals like \"8 glasses a day,\" which lacks scientific basis for universal application.";
    } else {
      response = "As a nutrition professional, I understand you're looking for evidence-based guidance. To provide the most accurate information tailored to your practice, could you share more specific details about:\n\n1. Your client's specific health concern or goal\n2. Any relevant medical conditions or medications\n3. Age group and activity level\n4. Dietary preferences or restrictions\n5. Previous nutrition approaches tried\n\nThis context will help me provide more personalized, clinically-relevant recommendations you can implement with your clients.";
    }
    
    // Add AI response to chat
    setChatMessages(prevMessages => [
      ...prevMessages, 
      { sender: 'ai', content: response }
    ]);
  };
  
  // Handle popular question click
  const handlePopularQuestionClick = (question) => {
    setChatMessages(prevMessages => [
      ...prevMessages, 
      { sender: 'user', content: question }
    ]);
    
    setTimeout(() => {
      generateAiResponse(question);
    }, 1000);
  };
  
  // Generate meal plan
  const handleGenerateMealPlan = () => {
    setChatMessages(prevMessages => [
      ...prevMessages, 
      { 
        sender: 'user', 
        content: "Can you generate a comprehensive meal plan template for a weight management client that includes macronutrient analysis?" 
      }
    ]);
    
    setTimeout(() => {
      setChatMessages(prevMessages => [
        ...prevMessages, 
        { 
          sender: 'ai', 
          content: `Here's a 1-day evidence-based meal plan template for weight management with complete macronutrient analysis:

## Weight Management Meal Plan (1,500 calories)
**Target macros:** 30% protein (113g), 40% carbs (150g), 30% fat (50g)

### Breakfast (400 calories)
- 3 egg whites + 1 whole egg scrambled (22g protein, 0g carbs, 6g fat)
- 1/2 cup cooked steel-cut oats (3g protein, 15g carbs, 1.5g fat)
- 1/2 cup blueberries (0.5g protein, 10g carbs, 0g fat)
- 1 tbsp ground flaxseed (1.5g protein, 2g carbs, 3g fat)
- Coffee with 1/4 cup unsweetened almond milk (0.5g protein, 0g carbs, 1g fat)
***Clinical notes:** High-fiber breakfast with low glycemic impact. Protein helps with morning satiety and minimizes mid-morning hypoglycemia.*

### Mid-morning Snack (180 calories)
- 3/4 cup 2% Greek yogurt (18g protein, 5g carbs, 3g fat)
- 1/4 cup berries (0.5g protein, 7g carbs, 0g fat)
- 5 almonds, whole (1g protein, 1g carbs, 3g fat)
***Clinical notes:** Protein-forward snack to maintain blood glucose levels. Low volume but high satiety.*

### Lunch (450 calories)
- 4 oz grilled chicken breast (35g protein, 0g carbs, 4g fat)
- 2 cups mixed greens (2g protein, 5g carbs, 0g fat)
- 1/4 medium avocado (1g protein, 3g carbs, 7g fat)
- 1/3 cup cooked quinoa (4g protein, 20g carbs, 1.5g fat)
- 1/2 cup cherry tomatoes (1g protein, 4g carbs, 0g fat)
- 1 tbsp olive oil + lemon dressing (0g protein, 0g carbs, 14g fat)
***Clinical notes:** Balanced lunch with complete proteins. Healthy fats improve absorption of fat-soluble nutrients.*

### Afternoon Snack (170 calories)
- 1 small apple (0.5g protein, 20g carbs, 0g fat)
- 1 tbsp almond butter (3.5g protein, 3g carbs, 9g fat)
***Clinical notes:** Fiber + fat combination slows digestion and stabilizes glucose response. Portable option for on-the-go clients.*

### Dinner (300 calories)
- 4 oz baked wild salmon (23g protein, 0g carbs, 9g fat)
- 1 cup roasted Brussels sprouts (4g protein, 12g carbs, 0g fat)
- 1/3 cup cooked brown rice (2.5g protein, 25g carbs, 0.5g fat)
- Herbs and spices to taste (0g protein, 0g carbs, 0g fat)
***Clinical notes:** Lower calorie dinner supports circadian eating patterns. Omega-3 content may improve sleep quality.*

### DAILY TOTALS
- Calories: 1,500
- Protein: 115g (31%)
- Carbohydrates: 147g (39%)
- Fat: 50g (30%)
- Fiber: ~30g

## Recommendations for client implementation:
1. Pre-portion proteins at beginning of week
2. Prepare breakfast night before for morning efficiency
3. Consider time-restricted eating (8-hour window) if appropriate
4. Monitor satiety levels using 1-10 scale
5. Hydrate with minimum 2L water daily, emphasizing morning consumption
6. Adjust portion sizes based on individual metabolic response

Would you like me to adapt this template for specific clinical conditions or dietary preferences?` 
        }
      ]);
    }, 1500);
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Nutrition AI Assistant</h3>
        <div className="flex flex-col h-[600px]">
          <div className="flex-1 overflow-y-auto mb-4 p-4 bg-gray-50 rounded-lg">
            {chatMessages.map((msg, index) => (
              <div key={index} className={`mb-4 ${msg.sender === 'ai' ? 'flex' : 'flex justify-end'}`}>
                <div className={`max-w-3/4 p-3 rounded-lg ${
                  msg.sender === 'ai' 
                    ? 'bg-white border border-gray-200 text-gray-800' 
                    : 'bg-purple-600 text-white'
                }`}>
                  <div className={`whitespace-pre-wrap ${msg.sender === 'ai' ? 'text-gray-800' : 'text-white'}`}>
                    {msg.content}
                  </div>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          
          {/* Chat Input */}
          <div className="border-t border-gray-200 pt-4">
            <div className="mb-2">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Popular Questions:</h4>
              <div className="flex flex-wrap gap-2 mb-2">
                <button 
                  onClick={() => handlePopularQuestionClick("What evidence-based strategies should I use for clients with insulin resistance?")}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs py-1 px-2 rounded-full"
                >
                  Insulin resistance strategies
                </button>
                <button 
                  onClick={() => handlePopularQuestionClick("What are the optimal macronutrient ratios for different clinical conditions?")}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs py-1 px-2 rounded-full"
                >
                  Clinical macronutrient ratios
                </button>
                <button 
                  onClick={() => handlePopularQuestionClick("How should I structure a low FODMAP protocol for IBS clients?")}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs py-1 px-2 rounded-full"
                >
                  Low FODMAP protocol
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mb-2">
                <button 
                  onClick={() => handlePopularQuestionClick("What periodized nutrition protocols are best for athletic clients?")}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs py-1 px-2 rounded-full"
                >
                  Periodized sports nutrition
                </button>
                <button 
                  onClick={() => handlePopularQuestionClick("What clinical considerations are important for prenatal nutrition?")}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs py-1 px-2 rounded-full"
                >
                  Clinical prenatal nutrition
                </button>
                <button 
                  onClick={() => handlePopularQuestionClick("What evidence supports specific dietary interventions for gut microbiome health?")}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs py-1 px-2 rounded-full"
                >
                  Evidence for microbiome interventions
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => handlePopularQuestionClick("What anti-inflammatory dietary protocols have the strongest clinical evidence?")}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs py-1 px-2 rounded-full"
                >
                  Anti-inflammatory protocols
                </button>
                <button 
                  onClick={() => handlePopularQuestionClick("How should I adjust macronutrients for clients with PCOS?")}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs py-1 px-2 rounded-full"
                >
                  PCOS nutrition strategies
                </button>
                <button 
                  onClick={() => handlePopularQuestionClick("What nutritional strategies can support mental health conditions?")}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs py-1 px-2 rounded-full"
                >
                  Nutrition for mental health
                </button>
              </div>
              <div className="mt-2 mb-2">
                <h4 className="text-sm font-medium text-gray-700 mb-1">Common Client Questions:</h4>
                <div className="flex flex-wrap gap-2 mb-2">
                  <button 
                    onClick={() => handlePopularQuestionClick("What is a balanced diet, and why is it important?")}
                    className="bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs py-1 px-2 rounded-full"
                  >
                    Balanced diet importance
                  </button>
                  <button 
                    onClick={() => handlePopularQuestionClick("How many calories should I consume daily?")}
                    className="bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs py-1 px-2 rounded-full"
                  >
                    Daily calorie needs
                  </button>
                  <button 
                    onClick={() => handlePopularQuestionClick("What are the best sources of protein?")}
                    className="bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs py-1 px-2 rounded-full"
                  >
                    Best protein sources
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={() => handlePopularQuestionClick("Are carbs bad for me?")}
                    className="bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs py-1 px-2 rounded-full"
                  >
                    Carbs misconceptions
                  </button>
                  <button 
                    onClick={() => handlePopularQuestionClick("Should I avoid eating before bedtime?")}
                    className="bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs py-1 px-2 rounded-full"
                  >
                    Eating before bedtime
                  </button>
                  <button 
                    onClick={() => handlePopularQuestionClick("How can I improve digestion naturally?")}
                    className="bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs py-1 px-2 rounded-full"
                  >
                    Natural digestion tips
                  </button>
                </div>
              </div>
            </div>
            <div className="relative">
              <textarea
                value={messageInput}
                onChange={handleMessageInputChange}
                onKeyDown={handleMessageKeyDown}
                placeholder="Ask your nutrition question here..."
                className="w-full border border-gray-300 rounded-lg py-3 px-4 pr-12 focus:ring-purple-500 focus:border-purple-500 resize-none"
                rows="3"
              ></textarea>
              <button
                onClick={handleSendMessage}
                className="absolute right-3 bottom-3 bg-purple-600 text-white rounded-full p-2 hover:bg-purple-700"
                aria-label="Send message"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
            <div className="mt-3 flex justify-between">
              <button
                onClick={handleGenerateMealPlan}
                className="text-sm text-purple-600 hover:text-purple-800 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Generate Meal Plan
              </button>
              <button 
                className="text-sm text-gray-500 hover:text-gray-700"
                onClick={() => setChatMessages([{ 
                  sender: 'ai', 
                  content: "Hello! I'm your AI nutrition assistant. How can I help you with your nutrition planning today?" 
                }])}
              >
                Clear Chat
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiAssistant; 