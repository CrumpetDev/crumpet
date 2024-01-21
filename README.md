<!--
<p align="center">
  <img src="https://github.com/CrumpetDev/crumpet/assets/30439911/6ddd604a-336f-4b02-8094-17ed416f2d7b" alt="Crumpet_logo_square">
</p>
-->

<p align="center">
  <a href="https://cq4lqviw38a.typeform.com/to/aGnynFet">
    <img src="https://github.com/CrumpetDev/crumpet/assets/30439911/9f419669-1228-488c-88d1-22944657874f" alt="Repo_Header__4x">
  </a>
</p>

<h1 align="center">
  Butter up your audience and spread your message effectively.
</h1>

<p align="center">
  We help engineers and product teams solve customer retention and product education through open-source tooling.
</p>


<p align="center">
  <a href="https://www.opencrumpet.com/">🌎 Website</a> - <a href="#">📚 Documentation (soon)</a> - <a href="https://cq4lqviw38a.typeform.com/to/aGnynFet">📋 Waitlist</a> - <a href="https://join.slack.com/t/crumpetgroup/shared_invite/zt-1y0si8la9-YR0oxMmmYxRGmO2wmEPDrw" rel="nofollow"><img src="https://github.com/CrumpetDev/crumpet/assets/30439911/0a144f3b-6910-4b53-88dc-47ee09c02c5e" width="12" height="12" style="max-width: 100%; vertical-align: middle;"> Slack</a> - <a href="#"><img src="https://github.com/CrumpetDev/crumpet/assets/30439911/192ad5a4-8bb7-4547-8a4f-ccf2eb7cd5bc" width="12" height="12" style="max-width: 100%; vertical-align: middle;"> Figma (soon)</a>
</p>

<p align="center"> Only interested in features? <a href="#what-can-you-do"> You can skip the spiel by clicking here.</p>

## Why does this matter?
 

>    
> Building great software is hard.
> 
> <sub>*Someone, presumably...*</sub>
 
But educating users how to use software effectively, demonstrating the value-add it brings and keeping those users active over time is harder. When companies don’t educate, engage and keep their users active, they risk dissatisfying those users and increase the likelihood of churn.

Our goal is to bridge the gap between product and customer, helping users get up to speed with your software product quickly, automating customer engagements and providing a real time 360-view of customers at all stages of the adoption lifecycle.

### Can't I build this myself?

Absolutely, but building user education (product tours, checklists .. etc) and retention experiences (upselling dialogs, email engagements) into applications is time-consuming, often requiring:

- *constant code updates and database migrations.*
- *complex scheduling and user segmentation logic.*
- *crossover between frontend and backend teams.*
- *multiple sprints worth of dev time.*

### What about traditional Product Adoption Platforms?

Pendo, Intercom, AppCues and Chameleon are probably the most well known product adoption platforms. The problem with these platforms is that they all cater to non-technical users, cut out engineering and try to solve the problem by providing pre-built UI components. As a result they

- *aren't extensible and offer very limited customisation.*
- *only fit a handful of use cases (you’re stuck using tooltips and modals that work at a layer above your product via a JavaScript snippet).*
- *look and feel like an afterthought (since they don’t fit your design language or brand).*
- *are difficult (and often expensive) to self-host.*

## Why use Crumpet?

Crumpet allows developers to integrate onboarding, education and retention experiences into their software products natively and using their own UI components through a drag-and-drop workflow builder combined with an SDK.

- **🪄 Configure simply, engage purposefully:** modelling customer engagements as steps in a workflow gives engineers and designers as much freedom as possible. This means you can bring your own UI components or use our existing library of templates.
  
- **💪 Flexible customer data model:**  share whatever data you want with Crumpet and use this to target specific users or groups. This could be users on a free trial, users of a particular company or whatever you like - it’s just JSON under the hood , no need to retrofit your data into predefined objects on a remote cloud.
  
- **🔓 Open-source, open architecture:** Contribute, self-host, fork. Break free from vendor lock-in and join us in transforming how software businesses engage with their customers and drive product adoption.
  
- **🎨 Extendable and customisable:** Extend our API and connect Crumpet to your internal systems and tools (i.e. CDPs, CRMs, direct messaging tools like Slack … etc)
  
- **💸 Transparent pricing:** Our community self-hosted version will always be free and open-source. Our cloud version is priced like typical usage-based SaaS - you pay only for what you use.
  
- **💾 Own your data and host on your terms:** your data never has to leave your infrastructure.

## What can you do with Crumpet?
<a name="what-can-you-do"></a>
We’re currently in the development phase of Crumpet’s alpha version. If you have ideas, think something is missing, have a specific requirement or just want to ask a question, please either create an issue/disscussion or message our Slack community.

Here’s an idea of what you can build with Crumpet.

<table>
  <tr>
    <td><img src="https://github.com/CrumpetDev/crumpet/assets/30439911/19970dd7-20d2-4093-ac02-c41e3de1791e" alt="Checklists__4x"></td>
    <td><img src="https://github.com/CrumpetDev/crumpet/assets/30439911/a1004593-e2a1-4f03-bc97-ab982958d8c6" alt="Tours__4x"></td>
  </tr>
  <tr>
    <td><img src="https://github.com/CrumpetDev/crumpet/assets/30439911/55870a82-a59c-4a90-a9b1-16fdefe6cb63" alt="Modal__4x"></td>
    <td><img src="https://github.com/CrumpetDev/crumpet/assets/30439911/8b3949ac-f8aa-4587-81c4-892379a85186" alt="Contextual_Tips__4x"></td>
  </tr>
  <tr>
    <td><img src="https://github.com/CrumpetDev/crumpet/assets/30439911/f6d89d24-1826-4dc9-8d23-4b68edb26edc" alt="Hints__4x"></td>
    <td><img src="https://github.com/CrumpetDev/crumpet/assets/30439911/379f9df0-7ed2-42c0-a46d-676883b4ff9f" alt="Custom_components__4x"></td>
  </tr>
</table>


### Build engagements in a drag and drop editor

Engagements in Crumpet are just simple state machines, steps represent the state and transitions move state through the flow.

![Engagement_Editor__4x](https://github.com/CrumpetDev/crumpet/assets/30439911/c9cd1412-50df-4260-84db-cd176fa0f861)

You can access, manage and transition user flow state from code by calling the defined transition event. 

```jsx
const [block, transition] = getBlock(‘welcome-card’);

block.state.isActive; //true

transition(‘complete’);

block.state.isActive; //false
```

### Share, view and edit customer data

Identify your users and share as much or as little data as you like with absolutely no schema migrations. It’s just JSON under the hood, so you to query update and transform data into whatever structure you want.

![People_table__4x](https://github.com/CrumpetDev/crumpet/assets/30439911/e00782d8-57a0-4fb8-9b64-4bbdf074662b)

You can share data with Crumpet by manually creating and editing records within the web app or share it via the SDK or our API.

```jsx
crumpet.identify(userId, {
    "name": "Jared Dunn",
    "email": "jared.dunn@piedpiper.com",
    "properties": {
        "subscription_tier": "starter",
        "daily_active_hours": 1.2,
        "features_used": [
            "cloud_storage",
            "video_chat",
            "not_hotdog"
        ]
        //... anything you like
    }
});
```

### Segment customers to target specific people

Choose who should see your engagements by segmenting customers into groups based on shared criteria. Since it’s just JSON, you can create targeting rules on any properties you like.

![Build_customer_segments__4x](https://github.com/CrumpetDev/crumpet/assets/30439911/71bc052b-3ab7-4855-a264-706c5d4e0fea)

## The Road Ahead

Crumpet is still in development so expect regular updates and new features. If you have any ideas or features that you think we’re missing, please get in touch. 

Here’s what’s to come:

- 🗺️ Public roadmap (coming very soon).
- 🙌 Contributing guide with labelled 'good-first-issues' (coming very soon).
- 📚 Documentation (coming very soon).
- 🐳 Docker image.
- 🛠️ React SDK (other frameworks to follow).
- 🔌 Customise Crumpet with plugins and more.
- 🍽️ Templates and recipes.

## Get Involved

- You can star the repository.
- You can [join the waitlist to stay in the loop.](https://cq4lqviw38a.typeform.com/to/aGnynFet)
- Join our [Slack](https://join.slack.com/t/crumpetgroup/shared_invite/zt-1y0si8la9-YR0oxMmmYxRGmO2wmEPDrw).
- Contributions are extremely welcome (and very much appreciated)! If you're interested, please message me on Slack (for now) and I'll help you get set up.
