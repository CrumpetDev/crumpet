from app.models import Project, ProjectMembership
from django.contrib.auth import get_user_model

print("Seeding database...")

# Clear the database
ProjectMembership.objects.all().delete()
Project.objects.all().delete()
get_user_model().objects.all().delete()

# Create new User entries
User = get_user_model()

tom = User.objects.create_user(
    email="tom@opencrumpet.com",
    first_name="Tom",
    last_name="Titherington",
    password="Developer123!",
)

richard = User.objects.create_user(
    email="richard@piedpiper.com",
    first_name="Richard",
    last_name="Hendrix",
    password="Developer123!",
)

jared = User.objects.create_user(
    email="jared@piedpiper.com", first_name="Jared", last_name="Dunn", password="Developer123!"
)

# Create new Project entries
project1 = Project.objects.create(name="Cookie Dough")
project2 = Project.objects.create(name="Marmalade")


# Set Tom as admin for both projects and add members
ProjectMembership.objects.create(
    user=tom, project=project1, type=ProjectMembership.MembershipType.ADMIN
)
ProjectMembership.objects.create(
    user=richard, project=project1, type=ProjectMembership.MembershipType.MEMBER
)
ProjectMembership.objects.create(
    user=jared, project=project1, type=ProjectMembership.MembershipType.MEMBER
)
ProjectMembership.objects.create(
    user=tom, project=project2, type=ProjectMembership.MembershipType.ADMIN
)
ProjectMembership.objects.create(
    user=richard, project=project2, type=ProjectMembership.MembershipType.MEMBER
)
ProjectMembership.objects.create(
    user=jared, project=project2, type=ProjectMembership.MembershipType.MEMBER
)

print("Seed complete!")
