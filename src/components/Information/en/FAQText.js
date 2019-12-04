import React from "react";
import { Mutation } from "react-apollo";
import { SEEN_TOUR } from "../../../queries";

const FAQ = () => {
  const seenTourNotify = seenTour => {
    seenTour();
    alert("Tour Reset. Please visit the app to see the tours.");
  };
  return (
    <div>
      <ul>
        <li>
          <p>Is it all about sex?</p>
          <p>
            It depends on what you’re looking for. Members are here looking for
            everything from flirting and cuddling to relationships and swinging.
            Many members are simply experimenting with sexualities and kinks.
            You can get an idea of what a member might be interested in by
            looking at their kinks. Kinks are not a requirement of the
            member. Please be respectful.
          </p>
        </li>
        <li>
          <p>My/Our profile is anonymous? </p>
          <p>
            Yes. Your profile shows only what you like. Theirs is no public
            access, only members can see your profile.
          </p>
        </li>
        <li>
          <p>What is Foxtail?</p>
          <p>The name has no meaning.</p>
        </li>
        <li>
          <p>Who is Foxtail?</p>
          <p>Foxtail includes all of us who enjoy consensual adult play.</p>
        </li>
        <li>
          <p>Where is Foxtail?</p>
          <p>We’re a US based organization by LOV Inc.</p>
        </li>
        <li>
          <p>What privacy tools are there?</p>
          <p>
            Foxtail uses military-grade encryption on all personal information
            in our database.
          </p>
          <p>
            {" "}
            All photos are safely hosted by Amazon and only accessible via our
            website. When you upload photos into Foxtail you can easily add
            Masks (stickers) to your face.
          </p>
          <p>
            Your name isn’t required to use foxtail but you’ll need to use your
            phone to login via Facebook’s Account Kit login. Facebook, ONLY
            verifies you are the owner of the phone and doesn't store your phone
            number. Email is required to communicate in Foxtail, this ensures
            you’ll get all messages (but you can turn off emails).{" "}
          </p>
          <p>
            It is IMPOSSIBLE for your personal information to be retrieved from
            Foxtail’s service, unless you post your information purposefully.
          </p>
          <p>
            There are many tools to empower you to handle your privacy
            including: blocking members, reporting members, and hiding
            visibility.
          </p>
        </li>
        <li>
          {" "}
          <p>How do I know members on the site are real?</p>
          <p>
            We only allow people to join using phone numbers. You may only be
            contacted by members who are active.
          </p>
          <p>
            Also, if profiles seem fake or illegal, our members will report them
            which alerts us to remove the profiles.
          </p>
        </li>
        <li>
          {" "}
          <p>What if I change my phone number?</p>
          <p>
            You can use the “Reset Phone Number” link at the bottom of the home
            page if not logged in. You’ll need to enter the last number you
            remember then you’ll get an email with a link to confirm. If you’re
            logged in use the “Change Phone Number” button on the Settings page.
          </p>
          <p>
            You can use the “Reset Phone Number” link at the bottom of the home
            page if not logged in. You’ll need to enter the last number you
            remember then you’ll get an email with a link to confirm. If you’re
            logged in use the “Change Phone Number” button on the Settings page.
          </p>
        </li>
        <li>
          {" "}
          <p>Can I fully delete my account?</p>
          <p>
            Your account is fully deleted when you select the Delete Account
            button in Settings. *This is not the case if your account has been
            flagged for violation. When this occurs, we will determine what
            actions need to be taken due to the severity of the violation. In
            most cases, we’ll simply delete the account.
          </p>
          <p>
            Your account is fully deleted when you select the Delete Account
            button in Settings. *This is not the case if your account has been
            flagged for violation. When this occurs, we will determine what
            actions need to be taken due to the severity of the violation. In
            most cases, we’ll simply delete the account.
          </p>
        </li>
        <li>
          {" "}
          <p>How do you handle abuse and harassment?</p>
          <p>
            We allow you to report members, events, and chat rooms. We
            investigate all reports as soon as possible and take action
            according to our terms.
          </p>
        </li>
        <li>
          {" "}
          <p>Is it Free? How long?</p>
          <p>
            Yes, your free account is yours to keep – forever. You can receive
            and reply to messages, search for members, and attend events. And if
            you want more, you can easily upgrade to "BLACK" membership for a
            small monthly cost.
          </p>
        </li>
        <li>
          <p>Can I see the tutorial again?</p>
          <p>
            Sure. Once logged in. Click here:{" "}
            <Mutation
              mutation={SEEN_TOUR}
              variables={{
                tour: "reset"
              }}
            >
              {seenTour => {
                return (
                  <span
                    onClick={() => seenTourNotify(seenTour)}
                    style={{
                      textDecoration: "underline",
                      color: "blue",
                      cursor: "pointer"
                    }}
                  >
                    Reset Tour
                  </span>
                );
              }}
            </Mutation>
          </p>
        </li>
      </ul>
    </div>
  );
};

export default FAQ;
