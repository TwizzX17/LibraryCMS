namespace LibraryCmsShared.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class InitialNew : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Authors",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.BookAuthors",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        BookId = c.Int(nullable: false),
                        AuthorId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Authors", t => t.AuthorId, cascadeDelete: true)
                .ForeignKey("dbo.Books", t => t.BookId, cascadeDelete: true)
                .Index(t => t.BookId)
                .Index(t => t.AuthorId);
            
            CreateTable(
                "dbo.Books",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Title = c.String(nullable: false, maxLength: 60),
                        Resume = c.String(nullable: false, maxLength: 1000),
                        PicturePath = c.String(),
                        PageCount = c.Int(nullable: false),
                        Publisher = c.String(),
                        PublishedOn = c.DateTime(nullable: false),
                        Status = c.Int(nullable: false),
                        DefaultRentalDays = c.Int(nullable: false),
                        BooksInStock = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .Index(t => t.Title, unique: true);
            
            CreateTable(
                "dbo.BookGenres",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        BookId = c.Int(nullable: false),
                        GenreId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Books", t => t.BookId, cascadeDelete: true)
                .ForeignKey("dbo.Genres", t => t.GenreId, cascadeDelete: true)
                .Index(t => t.BookId)
                .Index(t => t.GenreId);
            
            CreateTable(
                "dbo.Genres",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Rentals",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        UserId = c.Int(nullable: false),
                        BookId = c.Int(nullable: false),
                        BookTitle = c.String(),
                        RentalDate = c.DateTime(nullable: false),
                        ReturnDeadline = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Books", t => t.BookId, cascadeDelete: true)
                .ForeignKey("dbo.Users", t => t.UserId, cascadeDelete: true)
                .Index(t => t.UserId)
                .Index(t => t.BookId);
            
            CreateTable(
                "dbo.Users",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Email = c.String(nullable: false, maxLength: 80),
                        Password = c.String(nullable: false, maxLength: 50),
                        FullAddress = c.String(nullable: false, maxLength: 120),
                        LoanLimit = c.Int(nullable: false),
                        ApprovedUser = c.Boolean(nullable: false),
                        IsAdmin = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .Index(t => t.Email, unique: true);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Rentals", "UserId", "dbo.Users");
            DropForeignKey("dbo.Rentals", "BookId", "dbo.Books");
            DropForeignKey("dbo.BookGenres", "GenreId", "dbo.Genres");
            DropForeignKey("dbo.BookGenres", "BookId", "dbo.Books");
            DropForeignKey("dbo.BookAuthors", "BookId", "dbo.Books");
            DropForeignKey("dbo.BookAuthors", "AuthorId", "dbo.Authors");
            DropIndex("dbo.Users", new[] { "Email" });
            DropIndex("dbo.Rentals", new[] { "BookId" });
            DropIndex("dbo.Rentals", new[] { "UserId" });
            DropIndex("dbo.BookGenres", new[] { "GenreId" });
            DropIndex("dbo.BookGenres", new[] { "BookId" });
            DropIndex("dbo.Books", new[] { "Title" });
            DropIndex("dbo.BookAuthors", new[] { "AuthorId" });
            DropIndex("dbo.BookAuthors", new[] { "BookId" });
            DropTable("dbo.Users");
            DropTable("dbo.Rentals");
            DropTable("dbo.Genres");
            DropTable("dbo.BookGenres");
            DropTable("dbo.Books");
            DropTable("dbo.BookAuthors");
            DropTable("dbo.Authors");
        }
    }
}
