---
permalink: /publications/
title: Publications
excerpt: ""
author_profile: true
layout: default
classes: wide
---

{% if site.google_scholar_stats_use_cdn %}
{% assign gsDataBaseUrl = "https://cdn.jsdelivr.net/gh/" | append: site.repository | append: "@" %}
{% else %}
{% assign gsDataBaseUrl = "https://raw.githubusercontent.com/" | append: site.repository | append: "/" %}
{% endif %}
{% assign url = gsDataBaseUrl | append: "google-scholar-stats/gs_data_shieldsio.json" %}

{% include base_path %}

{% if page.author and site.data.authors[page.author] %}
  {% assign author = site.data.authors[page.author] %}{% else %}{% assign author = site.author %}
{% endif %}


# SELECTED PUBLICATIONS 

You can find all my articles on my <a href="{{author.googlescholar}}">Google Scholar profile</a>.

<div class='paper-box'><div class='paper-box-image'><div><div class="badge">ICME 2024</div><img src='/images/handCS.png' alt="sym" width="100%"></div></div>
<div class='paper-box-text' markdown="1">

<h3>The Correlation Analysis Between Cybersickness and Postural Behavior in Immersive VR Experience</h3>

*Ying Zhong*, Ke-Ao Zhao, Leping Zhang, Fangming Zhao, Wentao Wei and Feilin Han

<!--[**Project**](https://scholar.google.com/citations?view_op=view_citation&hl=zh-CN&user=DhtAFkwAAAAJ&citation_for_view=DhtAFkwAAAAJ:ALROH1vI_8AC) <strong><span class='show_paper_citations' data='DhtAFkwAAAAJ:ALROH1vI_8AC'></span></strong>-->
- This work investigates the relationship between cybersickness and hand posture behavior.
- [[link]](https://doi.org/10.1109/ICME57554.2024.10687394) 
</div>
</div>

<div class='paper-box'><div class='paper-box-image'><div><div class="badge">HCMA 2023</div><img src='/images/viewbehavior.png' alt="sym" width="100%"></div></div>
<div class='paper-box-text' markdown="1">

<h3>An Analytical Study of Visual Attention Behavior in Viewing Panoramic Video</h3>

Feilin Han, *Ying Zhong* and Ke-Ao Zhao

<!--[**Project**](https://scholar.google.com/citations?view_op=view_citation&hl=zh-CN&user=DhtAFkwAAAAJ&citation_for_view=DhtAFkwAAAAJ:ALROH1vI_8AC) <strong><span class='show_paper_citations' data='DhtAFkwAAAAJ:ALROH1vI_8AC'></span></strong>-->
- This work investigates viewing behavior, summarize attention distribution regulations and derive practical insights into the aspects of learning decision-making for panorama production.
- [[link]](https://doi.org/10.1145/3606041.3618060) [[PDF]](/images/hcma23.pdf)
</div>
</div>

<div class='paper-box'><div class='paper-box-image'><div><div class="badge">ICME 2022</div><img src='/images/cvr.png' alt="sym" width="100%"></div></div>
<div class='paper-box-text' markdown="1">

<h3>Evaluating the Effect of Cinematography on the Viewing Experience in Immersive Environment</h3>

Feilin Han, *Ying Zhong* and Minxi Zhou

<!--[**Project**](https://scholar.google.com/citations?view_op=view_citation&hl=zh-CN&user=DhtAFkwAAAAJ&citation_for_view=DhtAFkwAAAAJ:ALROH1vI_8AC) <strong><span class='show_paper_citations' data='DhtAFkwAAAAJ:ALROH1vI_8AC'></span></strong>-->
- This work investigates the relationship between viewing experience and various factors in Cinematic VR, and proposes an attention–comfort–understanding analysis paradigm to help creators better capture viewers' attention and enhance narrative comprehension.
- [[link]](https://doi.org/10.1109/ICME52920.2022.9859864) [[PDF]](/images/icme22.pdf)
</div>
</div>
