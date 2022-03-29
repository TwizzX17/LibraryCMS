namespace LibraryCmsShared.Migrations
{
    using LibraryCmsShared.Models;
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;
    using System.Collections.Generic;

    internal sealed class Configuration : DbMigrationsConfiguration<LibraryCmsShared.Context>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
        }

        protected override void Seed(LibraryCmsShared.Context context)
        {
            //  This method will be called after migrating to the latest version.

            //  You can use the DbSet<T>.AddOrUpdate() helper extension method
            //  to avoid creating duplicate seed data.
            const int IdAdventure = 1;
            const int IdScifi = 2;
            const int IdHorror = 3;
            const int IdCrime = 4;
            const int IdFantasy = 5;
            const int IdGrimdark = 6;
            const int IdHumor = 7;
            const int IdMystery = 8;

            context.Genres.AddOrUpdate(
                g => g.Name,
                new Genre() { Id = IdAdventure, Name = "Eventyr", PicturePath = @"genres/adventure.png" },
                new Genre() { Id = IdScifi, Name = "Science Fiction", PicturePath = @"genres/scifi.png" },
                new Genre() { Id = IdHorror, Name = "Gys", PicturePath = @"genres/horror.png" },
                new Genre() { Id = IdCrime, Name = "Krimi", PicturePath = @"genres/crime.png" },
                new Genre() { Id = IdFantasy, Name = "Fantasi", PicturePath = @"genres/fantasy.png" },
                new Genre() { Id = IdGrimdark, Name = "Grimdark", PicturePath = @"genres/grimdark.png" },
                new Genre() { Id = IdHumor, Name = "Humor", PicturePath = @"genres/humor.png" },
                new Genre() { Id = IdMystery, Name = "Mysterie", PicturePath = @"genres/mystery.png" }
                );

            var HarryPotterHalfblood = new Book()
            {
                Id = 1,
                Title = "Harry Potter & the Half Blood Prince",
                Author = "J. K. Rowling",
                Resume = "The story of Harry Potter & the Half Blood Prince unfolds many of the mysteries that have been build up so far in the story! Buckle up buckeroo with Ronald weasley and Sherry Hermione for yet another grand adventure with the Happy Potter!",
                PicturePath = @"books/harrypotterhalfblood.png",
                PageCount = 607,
                Publisher = "Bloomsbury (UK)",
                PublishedOn = DateTime.Parse("16-07-2005"),
                Status = 1,
                DefaultRentalDays = 14,
                BooksInStock = 3
            };

            HarryPotterHalfblood.AddGenre(IdFantasy);
            HarryPotterHalfblood.AddGenre(IdAdventure);

            context.Books.AddOrUpdate(
                b => b.Id,
                HarryPotterHalfblood);

            var StarWarsFirst = new Book()
            {
                Id = 2,
                Title = "Star Wars: Episode I - The Phantom Menace",
                Author = "George Lucas",
                Resume = "isn't this a movie? anyways: THE PHANTOM MENACE Turmoil has engulfed the Galactic Republic. The taxation of trade routes to outlying star systems is in dispute.  Hoping to resolve the matter with a blockade of deadly battleships, the greedy Trade Federation has stopped all shipping to the small planet of Naboo.  While the Congress of the Republic endlessly debates this alarming chain of events, the Supreme Chancellor has secretly dispatched two Jedi Knights, the guardians of peace and justice in the galaxy, to settle the conflict....",
                PicturePath = @"books/StarWarsFirst.jpg",
                PageCount = 404,
                Publisher = "LucasArts",
                PublishedOn = DateTime.Parse("19-08-1999"),
                Status = 1,
                DefaultRentalDays = 14,
                BooksInStock = 1
            };

            StarWarsFirst.AddGenre(IdScifi);
            StarWarsFirst.AddGenre(IdAdventure);

            context.Books.AddOrUpdate(
                b => b.Id,
                StarWarsFirst);

            var FirstGoT = new Book()
            {
                Id = 3,
                Title = "A Game of Thrones",
                Author = "George R. R. Martin",
                Resume = "A Game of Thrones takes place over the course of one year on or near the fictional continent of Westeros. The story begins when King Robert visits the northern castle Winterfell to ask Ned Stark to be his right-hand assistant, or Hand of the King. The previous Hand, Jon Arryn, died under suspicious circumstances. Robert comes with his queen, Cersei Lannister, and his retinue, which includes a number of Lannisters. Just after the royal party arrives, Ned’s wife, Catelyn, receives a message claiming that the Lannister family was responsible for the death of the former Hand. She tells Ned, who accepts the position as Hand in order to protect Robert from the Lannisters. Ned’s son Bran then discovers Cersei Lannister and her brother Jaime Lannister having sex, and Jaime pushes Bran from a window to silence him. Everyone thinks Bran simply fell while climbing around the castle. While Bran is still unconscious, Ned leaves Winterfell and rides south with Robert. The same day, Ned’s bastard son, Jon, leaves to serve at the Wall, a massive structure that protects Westeros from the wilderness of the far North. The group of men sworn to defend the Wall, the Night’s Watch, have been receiving reports of strange creatures and have been losing men with increasing frequency. Tyrion Lannister, a little person who is brother to Cersei and Jaime, travels with Jon to the Wall to see the massive structure. Meanwhile, on a continent east of Westeros, Daenerys Targaryen marries the warlord Khal Drogo, one of the leaders of the Dothraki people. Daenerys and her brother Viserys are the last surviving members of the family Robert defeated to become king, the Targaryens. They are an old family said to be descended from dragons, and Viserys thinks with Khal Drogo’s army he can retake the throne. A knight named Ser Jorah Mormont, exiled by Ned Stark, pledges he will help. Daenerys receives three dragon eggs as a wedding gift and becomes immediately fascinated by them.",
                PicturePath = @"books/FirstGoT.jpg",
                PageCount = 694,
                Publisher = "Bantam Spectra (US) - Voyager Books (UK)",
                PublishedOn = DateTime.Parse("01-08-1996"),
                Status = 1,
                DefaultRentalDays = 14,
                BooksInStock = 5
            };

            FirstGoT.AddGenre(IdGrimdark);

            context.Books.AddOrUpdate(b => b.Id,
                FirstGoT
                );

            var FirstLotR = new Book()
            {
                Id = 4,
                Title = "The Fellowship of the Ring First Edition",
                Author = "J. R. R. Tolkien",
                Resume = "Mørkest fyrste i Mordor - Lord Sauron - opruster. Han mangler kun én ting for at lægge hele Midgaard for sine fødder og slavebinde alle dets folk - en magisk guldring med enorme kræfter. Den lille hobit Frodo får til opgave at destruere ringen ved at smide den ned i spalterne i dybet af Orodruin, dommedagsbjerget i Mordor, hvor den i sin tid blev smedet. Sammen med en udvalgt skare af hobitter, mennesker, en elv og en dværg drager han af sted på den eventyrlige og yderst farefulde færd.",
                PicturePath = @"books/FirstLotR.png",
                PageCount = 423,
                Publisher = "George Allen & Unwin",
                PublishedOn = DateTime.Parse("29-07-1954"),
                Status = 1,
                DefaultRentalDays = 14,
                BooksInStock = 0
            };

            FirstLotR.AddGenre(IdAdventure);

            context.Books.AddOrUpdate(b => b.Id,
                FirstLotR
                );

            var ScaryFunny = new Book()
            {
                Id = 5,
                Title = "A Funny Horror Story",
                Author = "Bogus Gas Man",
                Resume = "Der var en gang en forfærdelig morder som slo folk ihjel ved at lade dem dø af grin, han var nemlig hylende mordsom, hvis du forstår sådan en lille far-joke.",
                PicturePath = @"books/ScaryFunny.png",
                PageCount = 72,
                Publisher = "CoolPublishersInc",
                PublishedOn = DateTime.Parse("20-02-2021"),
                Status = 1,
                DefaultRentalDays = 5,
                BooksInStock = 10
            };

            ScaryFunny.AddGenre(IdHorror);
            ScaryFunny.AddGenre(IdHumor);

            context.Books.AddOrUpdate(b => b.Id,
                ScaryFunny);

            var CrimeCity = new Book()
            {
                Id = 6,
                Title = "Krimi Byen",
                Author = "Bogus Gas Man",
                Resume = "Der er aldrig nogensinde blevet begået så meget kriminalitet som i Krimi Byen! Vær med på denne uges sag, for kriminalinspektør Snorritz når mysteriemordet på enken af fabricius skal opklares!.",
                PicturePath = @"books/CrimeCity.png",
                PageCount = 420,
                Publisher = "CoolPublishersInc",
                PublishedOn = DateTime.Parse("21-02-2021"),
                Status = 1,
                DefaultRentalDays = 14,
                BooksInStock = 7
            };

            CrimeCity.AddGenre(IdCrime);

            context.Books.AddOrUpdate(b => b.Id,
                CrimeCity);

            var MysteryMeat = new Book()
            {
                Id = 7,
                Title = "Mysteriet om kødet",
                Author = "Bogus Gas Man",
                Resume = "Find ud af hvor kødet kommer fra!",
                PicturePath = @"books/MysteryMeat.png",
                PageCount = 80,
                Publisher = "CoolPublishersInc",
                PublishedOn = DateTime.Parse("21-02-2021"),
                Status = 1,
                DefaultRentalDays = 4,
                BooksInStock = 1
            };

            CrimeCity.AddGenre(IdMystery);

            context.Books.AddOrUpdate(b => b.Id,
                CrimeCity);

            var User1 = new User()
            {
                Id = 1,
                Email = "Test@Mail.dk",
                Password = BCrypt.Net.BCrypt.HashPassword("Test123"),
                FullAddress = "Test street 27 1000 Test City",
                LoanLimit = 3,
                ApprovedUser = false,
                IsAdmin = false,
                Created = DateTime.UtcNow
            };

            context.Users.AddOrUpdate(u => u.Id,
                User1);

            var Admin1 = new User()
            {
                Id = 2,
                Email = "Test@admin.dk",
                Password = BCrypt.Net.BCrypt.HashPassword("Test123"),
                FullAddress = "Test street 27 1000 Test City",
                LoanLimit = 3,
                ApprovedUser = true,
                IsAdmin = true,
                Created = DateTime.UtcNow
            };
            context.Users.AddOrUpdate(u => u.Id,
                Admin1);

            //debug seed method
            //if (!System.Diagnostics.Debugger.IsAttached)
            //    System.Diagnostics.Debugger.Launch();
        }
    }
}
