---
permalink: /about/
title: "Wing🪽"
seo_title: About
description: "About Ying (Wing) Zhong, an HCI PhD student at Indiana University, with selected publications on empathic computing, human-AI interaction, and immersive technologies."
excerpt: ""
author_profile: true
redirect_from:
  - /publications/
---

{% if site.google_scholar_stats_use_cdn %}
{% assign gsDataBaseUrl = "https://cdn.jsdelivr.net/gh/" | append: site.repository | append: "@" %}
{% else %}
{% assign gsDataBaseUrl = "https://raw.githubusercontent.com/" | append: site.repository | append: "/" %}
{% endif %}
{% assign url = gsDataBaseUrl | append: "google-scholar-stats/gs_data_shieldsio.json" %}

{% if page.author and site.data.authors[page.author] %}
  {% assign author = site.data.authors[page.author] %}{% else %}{% assign author = site.author %}
{% endif %}

<span class='anchor' id='about-me'></span>

# Hi There!
I'm Ying Zhong. You can call me Wing—that’s how it’s pronounced in Cantonese. 

I'm a PhD student at Department of Human-Centered Computing, Indiana University. I work with    [Dr.Ekaterina Muravevskaia](https://ekmurav.wixsite.com/empathy) in the [SETH Lab](https://sethlab.lab.indianapolis.iu.edu/index.html). I completed my MA in Film Production Studies and BEng in Digital Media Technology at the School of Intelligent Imagery Engineering, Beijing Film Academy. During my MA and BEng Studies, I was advised by [Dr. Feilin Han](http://feilinh.cn).

My research interests lie at the intersection of human-AI interaction, immersive technologies, and social computing. I am particularly interested in how AI agents can express emotions, demonstrate empathy, and support meaningful human interactions. My current research explores emotionally expressive virtual characters in XR and empathic interactions with LLM-based agents. 

<div class="notification-box">
<div class='notification-box-text' markdown="1">
📢 I am seeking collaboration opportunities. If you are interested in human-AI interaction and empathy or would like to collaborate, please feel free to <a href="mailto:{{ author.email }}">reach out</a>.
</div>
</div>

<div class="highlight-blocks">
<div class="highlight-block">
    <h3>HCI Researcher</h3>
    <ul>
      <li>Empathic Computing</li>
      <li>Human-AI Interaction</li>
      <li>VR, AR, MR, and XR</li>
    </ul>
  </div>
  
  <div class="highlight-block">
    <h3><em>Former</em> Digital Media Artist</h3>
    <ul>
      <li>Immersive Digital Art</li>
      <li>Virtual Production</li>
      <li>Photography</li>
    </ul>
  </div>
</div>

<!--My research interest includes neural machine translation and computer vision. I have published more than 100 papers at the top international AI conferences with total <a href='https://scholar.google.com/citations?user=DhtAFkwAAAAJ'>google scholar citations <strong><span id='total_cit'>260000+</span></strong></a> (You can also use google scholar badge <a href='https://scholar.google.com/citations?user=DhtAFkwAAAAJ'><img src="https://img.shields.io/endpoint?url={{ url | url_encode }}&logo=Google%20Scholar&labelColor=f6f6f6&color=9cf&style=flat&label=citations"></a>).-->

# LATEST NEWS
- *2025/11*: Presenting my poster in the Luddy 25th Symposium
- *2025/04*: Attending CHI25 in Yokohama

<span class='anchor' id='publications'></span>

# SELECTED PUBLICATIONS

You can find all my articles on my <a href="{{author.googlescholar}}">Google Scholar profile</a>.

<div class='paper-box'>
<h2 class="paper-box-title">The Correlation Analysis Between Cybersickness and Postural Behavior in Immersive VR Experience</h2>
<div class='paper-box-image'><div><div class="badge">Cybersickness</div><img src='/images/handCS.png' alt="Diagram of the cybersickness and postural behavior study" width="100%" loading="lazy" decoding="async"></div></div>
<div class='paper-box-text' markdown="1">

<p class="paper-box-venue">ICME 2024</p>

**Ying Zhong**, Ke-Ao Zhao, Leping Zhang, Fangming Zhao, Wentao Wei and Feilin Han

- This work investigates the relationship between cybersickness and hand posture behavior.
- 📄[Paper](https://feilinh.cn/ICME2024.pdf)
</div>
</div>

<div class='paper-box'>
<h2 class="paper-box-title">An Analytical Study of Visual Attention Behavior in Viewing Panoramic Video</h2>
<div class='paper-box-image'><div><div class="badge">Cinematic VR</div><img src='/images/viewbehavior.png' alt="Visualization of visual attention behavior in panoramic video" width="100%" loading="lazy" decoding="async"></div></div>
<div class='paper-box-text' markdown="1">

<p class="paper-box-venue">HCMA 2023</p>

Feilin Han, **Ying Zhong** and Ke-Ao Zhao

- This work investigates viewing behavior, summarize attention distribution regulations and derive practical insights into the aspects of learning decision-making for panorama production.
- 📄[Paper](https://doi.org/10.1145/3606041.3618060)
</div>
</div>

<div class='paper-box'>
<h2 class="paper-box-title">Evaluating the Effect of Cinematography on the Viewing Experience in Immersive Environment</h2>
<div class='paper-box-image'><div><div class="badge">Cinematic VR</div><img src='/images/cvr.png' alt="Diagram of the cinematic VR viewing experience study" width="100%" loading="lazy" decoding="async"></div></div>
<div class='paper-box-text' markdown="1">

<p class="paper-box-venue">ICME 2022</p>

Feilin Han, **Ying Zhong** and Minxi Zhou

- This work investigates the relationship between viewing experience and various factors in Cinematic VR, and proposes an attention–comfort–understanding analysis paradigm to help creators better capture viewers' attention and enhance narrative comprehension.
- 📄[Paper](https://feilinh.cn/ICME2022.pdf)
</div>
</div>

# EDUCATIONS
- *2025/08 - Now*, PhD, Indiana University Indianapolis, IN
- *2022/09 - 2025/07*, MA, Beijing Film Academy, Beijing
- *2018/09 - 2022/06*, BEng, Beijing Film Academy, Beijing

# AWARDS & SERVICES
- *2024/12*, National Scholarship (Top 3%)
- *2022/01 - 2022/03*, Professional Photography Volunteer, *Beijing Olympic and Paralympic Winter Games*
- *2019/05 - 2020/12*, Technical Volunteer, *International Student Film and Video Festival (ISFVF)*
