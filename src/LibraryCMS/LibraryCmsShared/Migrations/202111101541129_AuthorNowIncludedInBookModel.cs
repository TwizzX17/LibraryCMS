namespace LibraryCmsShared.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AuthorNowIncludedInBookModel : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.BookAuthors", "AuthorId", "dbo.Authors");
            DropForeignKey("dbo.BookAuthors", "BookId", "dbo.Books");
            DropIndex("dbo.BookAuthors", new[] { "BookId" });
            DropIndex("dbo.BookAuthors", new[] { "AuthorId" });
            AddColumn("dbo.Books", "Author", c => c.String());
            DropTable("dbo.Authors");
            DropTable("dbo.BookAuthors");
        }
        
        public override void Down()
        {
            CreateTable(
                "dbo.BookAuthors",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        BookId = c.Int(nullable: false),
                        AuthorId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Authors",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            DropColumn("dbo.Books", "Author");
            CreateIndex("dbo.BookAuthors", "AuthorId");
            CreateIndex("dbo.BookAuthors", "BookId");
            AddForeignKey("dbo.BookAuthors", "BookId", "dbo.Books", "Id", cascadeDelete: true);
            AddForeignKey("dbo.BookAuthors", "AuthorId", "dbo.Authors", "Id", cascadeDelete: true);
        }
    }
}
